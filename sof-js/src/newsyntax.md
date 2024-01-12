DSL consists of set of "functions"

* select - Cartesian product of partial row sets
* column - columns extraction
* forEach - unroll nested expressions 
* forEachOrNull - unroll nested expressions 
* unionAll - concatenate row sets


```js
select(
  column([{name: 'id', path: 'id'}, ]),
  forEach('address', columns(...)),
  unionAll(
    forEach(...),
    forEach(...))
  {where: '...'});
```


Here is JSON syntax for it.

```js
{select: [
  {column: []},
  {forEach: 'address',
   select: [{columns: []}]}
  {unionAll: [
   {select: []},
   {select: []}]}]
 where: '...'}
```

### Keywords combinations transform

In case of keyword combinations here are rewrite rules to choose the main function and make params

* foreach    / columns / [select(..)]   -> foreach select[columns, ..]
* foreach    / union / [select(..)]     -> foreach select[union, ..]
* foreach    / select(..)               -> foreach select[..]
* select[..] / union                    -> select [union, ..]
* select[..] / columns                  -> select [columns, ..]
* union      / columns                  -> select [columns, union]

