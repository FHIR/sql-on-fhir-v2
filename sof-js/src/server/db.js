import sqlite3 from 'sqlite3';
import { readResourcesFromDirectory, getFHIRData, resourceTypes } from './utils.js';

export function getDb() {
  const db = new sqlite3.Database('./db.sqlite');
  return db;
}


function loadCanonicalResources(config, resourceType) {
  console.log(`Loading ${resourceType} canonical resources`);
  const migrate = `CREATE TABLE IF NOT EXISTS ${resourceType.toLowerCase()} ( id text PRIMARY KEY, resource JSON);`
  const db = config.db;
  db.serialize(() => {
    db.run(migrate);
    const resources = readResourcesFromDirectory(resourceType);
    const stmt = db.prepare(`INSERT OR REPLACE INTO ${resourceType.toLowerCase()} (id, resource) VALUES (?, ?)`);
    resources.forEach(resource => {
      stmt.run(resource.id, JSON.stringify(resource));
    });
    stmt.finalize();
  });
}

async function loadResources(config, resourceType) {
  console.log(`Loading ${resourceType} resources`);
  const migrate = `CREATE TABLE IF NOT EXISTS ${resourceType.toLowerCase()} ( id text PRIMARY KEY, resource JSON);`

  const db = config.db;
  db.serialize(async () => {
    db.run(migrate);
    const stmt = db.prepare(`INSERT OR REPLACE INTO ${resourceType.toLowerCase()} (id, resource) VALUES (?, ?)`);
    const count = await select(config, `SELECT COUNT(*) as count FROM ${resourceType.toLowerCase()}`);
    console.log(resourceType, count);
    if (count[0].count > 0) {
      return;
    }
    const resources = await getFHIRData(resourceType);
    resources.forEach(resource => {
      stmt.run(resource.id, JSON.stringify(resource));
    });
    console.log(`Loaded ${resources.length} ${resourceType} resources`);
    stmt.finalize();
  });
}

export async function migrate(config) {
  const canonicals = ['ViewDefinition', 'OperationDefinition', 'CodeSystem', 'ValueSet'];
  canonicals.forEach(resourceType => {
    loadCanonicalResources(config, resourceType);
  });

  resourceTypes.forEach(async resourceType => {
    await loadResources(config, resourceType);
  });
}

export async function select(config, query) {
  return new Promise((resolve, reject) => {
    config.db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

export async function search(config, resourceType, limit = 100) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${resourceType.toLowerCase()} LIMIT ${limit}`;
    config.db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map(row => JSON.parse(row.resource)));
      }
    });
  });
}

export async function read(config, resourceType, id) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${resourceType.toLowerCase()} WHERE id = ?`;
    config.db.get(query, [id], (err, row) => {
      if (err) {
        reject(err);
      } else {
        if(row?.resource) {
          resolve(JSON.parse(row.resource));
        } else {
          resolve(null);
        }
      }
    });
  });
}

export async function expandValueSet(config, valueSetUrl) {
  const valueSets = await search(config, 'ValueSet');
  const codeSystems = await search(config, 'CodeSystem');
  const valueSet = valueSets.filter(v => v.url === valueSetUrl)[0];

  if (valueSet) {
    const system = valueSet.compose?.include[0]?.system;
    const codeSystem = codeSystems.filter(c => c.url === system)[0];
    if (codeSystem) {
      valueSet.concept = codeSystem.concept;
      return  valueSet;
    } else {
      return valueSet;
    }
  } else {
    return null;
  }
}
