# 2.0.0

- Removing the ability to call Model.remove() and Model.create() since those aren't compatible with how this library works.
- Muuuuch better tests
- Embedded permissions object cannot be overwritten
- When a document has embedded permissions, those permissions will be checks when a save or remove is being done. That way someone cannot write to an object in a way that changes their permssions and then try to save it.
- Does not add permissions when a doc is empty