# https://cql.hl7.org/examples/ChlamydiaScreening_CQM.cql

create view sexual_active AS (
  select cd.patient.id from condition cd, concept cp
   where cd.code = cp.code
     and cp.valueset in ('genital_herpes', 'genecological')
  union
  select cd.patient.id from diagnosticreport cd, concept cp
   where cd.code = cp.code
     and cp.valueset in ('pap_test', '..')
);

create view chlamidia_screening AS (
  select cd.patient.id from diagnosticreport cd, concept cp
   where cd.code = cp.code
     and cp.valueset in ('chlamidia_screening')
);

create view population AS (
  select id from patient
    where age(patient.birthDate) between (16,24)
);


select
(select count(id) from population p, sexual_active s where p.id = s.id)
 /
(select count(id) fromp population p, sexual_active s, chlamidia_screening c where p.id = s.id nd c.id =p.is)


create table ranges ();

insert code, h, l


-- validate observations for ranges
select * from observation o, ranges r
where
  (value.quantity.value < r.l or value.quantity.value > r.h )


