## Processing Algorithm (Model)

The following description provides an algorithm for how to process a FHIR
resource as input for a `ViewDefinition`. Implementations do not need to follow
this algorithm directly, but their outputs should be consistent with what this
model produces.

### Validate Columns

**Purpose**: This step ensures that a ViewDefinition's columns are valid, by setting up a recursive call.

**Inputs**
* `V`: a `ViewDefinition` to validate

1. Call `ValidateColumns([], V)` according to the recursive step below.

#### `ValidateColumns(S, C)` (Recursive Step)

**Purpose:** This step ensures that column names are unique across `S` and disjoint from `C`

**Inputs**
* `S`: a single Selection Structure 
* `C`: a list of Columns

**Outputs**
* `Ret`: a list of Columns 

**Errors**
* Column Already Defined
* Union Branches Inconsistent

0. Initialize `Ret` to equal `C`

1. For each Column `col` in `S.column[]`
    * If a Column with name `col.name` already exists in `Ret`, throw "Column Already Defined"
    * Otherwise, append `col` to `Ret`

2. For each Selection Structure `sel` in `S.select[]`
    * For each Column `c` in `Validate(sel, Ret)`
        * If a Column with name `c.name` already exists in `Ret`, throw "Column Already Defined"
        * Otherwise, append `c` to the end of `Ret`

3. If `S.unionAll[]` is present
    1. Define `u0` as `Validate(S.unionAll[0], Ret)`
    2. For each Selection Structure `sel` in `S.unionAll[]`
        * Define `u` as  `ValidateColumns(sel, Ret)`
            * If the list of names from `u0` is different from the list of names from `u`, throw "Union Branches Inconsistent"
            * Otherwise, continue
    3. For each Column `col` in `u0`
        * Append `col` to `Ret`

4. Return `Ret`

### Process a Resource

**Purpose:** This step emits all rows produced by a ViewDefinition on an input Resource, by setting up a recursive call.

**Inputs**
* `V`: a `ViewDefinition`
* `R`: a FHIR Resource to process with `V`

**Emits:** one output row at a time

1. Ensure resource type is correct
    * If `R.resourceType` is different from `V.resource`, return immediately without emitting any rows
    * Otherwise, continue
2. If `V.where` is defined, ensure constraints are met
    * Evaluate `fhirpath(V.where.path, R)` to determine whether `R` is a candidate for `V`
        * If `R` is not a candidate for `V`, return immediately without emitting any rows
        * Otherwise, continue
3. Emit all rows from `Process(S, V)`

#### `Process(S, N)` (Recursive Step)

**Purpose:** This step emits all rows for a given Selection Structure and Node. We first generates sets of "partial rows" (i.e., sets of incomplete column bindings from the various clauses of `V`) and combine them to emit complete rows. For example, if there are two sets of partial rows:

* `[{"a": 1},{"a": 2}]` with bindings for the variable `a`
* `[{"b": 3},{"b": 4}]` with bindings for the variable `b`

Then the Cartesian product of these sets consists of four complete rows:

```js
[
  {"a": 1, "b": 3},
  {"a": 1, "b": 4},
  {"a": 2, "b": 3},
  {"a": 2, "b": 4}
]
```

**Inputs**
* `S`: a Selection Structure
* `N`: a Node (element) from a FHIR resource

**Errors**
* Multiple values found but not expected for column

**Emits:** One output row at a time

1. Define a list of Nodes `foci` as
    *  If `S.forEach` is defined: `fhirpath(S.forEach, N)`
    *  Else if `S.forEachOrNull` is defined: `fhirpath(S.forEachOrNull, N)`
    *  Otherwise: `[N]` (a list with just the input node)

2. For each element `f` of `foci`
    1. Initialize an empty list `parts` (each element of `parts` will be a list of partial rows)
    2. Process Columns:
        * For each Column `col` of `S.column`, define `val` as  `fhirpath(col.path, f)`
            1. Define `b` as a row whose column named `col.name` takes the value
                * If `val` was the empty set: `null`
                * Else if `val` has a single element `e`: `e`
                * Else if `col.collection` is true: `val`
                * Else: throw "Multiple values found but not expected for column"
            2. Append `[b]` to `parts`
            * (Note: append a list so the final element of `parts` is now a list containing the single row `b`).
    3. Process Selects:
        * For each selection structure `sel` of `S.select`
            1. Define `rows` as the collection of all rows emitted by `Process(sel, f)`
            2. Append `rows` to `parts`
            * (Note: do not append the elements but the whole list, so the final element of `parts` is now the list `rows`)
    4. Process UnionAlls:
        1. Initialize `urows` as an empty list of rows
        2. For each selection structure `u` of `S.unionAll`
            * For each row `r` in `Process(u, f)`
                * Append `r` to `urows`
        3. Append `urows` to `parts`
        * (Note: do not append the elements but the whole list, so the final element of `parts` is now the list `urows`)
    5. For every list of partial rows `prows` in the Cartesian product of `parts`
        1. Initialize a blank row `r`
        2. For each partial row `p` in `prows`
            * Add `p`'s column bindings to the row `r`
        3. Emit the row `r`
3. If  `foci` is an empty list and `S.forEachOrNull` is defined
    * (Note: when this condition is met, no rows have been emitted so far)
    1. Initialize a blank row `r`
    2. For each Column `c` in `ValidateColumns(V, [])`
        * Bind the column `c.name` to `null` in the row `r`
    3. Emit the row `r`
