Perfect. That's actually even better than using the row index.

If the client list has an **S/N** column, then that should become the identity of the record throughout Idotte.

For example, instead of:

```ts
export interface ClientRecord {
  name: string;
}
```

I'd evolve it to:

```ts
export interface ClientRecord {
  serialNumber: string;

  name: string;
}
```

(or `number` if the S/N is always numeric).

Then your React keys become:

```tsx
duplicates.map((duplicate) => (
  <DuplicateReviewCard
    key={duplicate.client.serialNumber}
    duplicate={duplicate}
  />
))
```

or for tables:

```tsx
matched.map((record) => (
  <tr key={record.client.serialNumber}>
    ...
  </tr>
))
```

---

### Why this is the right approach

Names are **not unique**.

S/N is.

Think of S/N as the client's primary key.

Example:

| S/N | Name                      |
| --: | ------------------------- |
|  15 | Adeniyi Abigail Ebunoluwa |
| 186 | Adeniyi Abigail Ebunoluwa |

React sees:

```tsx
key={15}
key={186}
```

No warning.

---

### It also helps the user

Imagine an unmatched record.

Instead of:

```text
Adeniyi Abigail Ebunoluwa
```

you can display:

```text
S/N 186
Adeniyi Abigail Ebunoluwa
```

Now if the user opens the original workbook, they immediately know exactly which row they're looking at.

---

### I'd make one small enhancement

Since the S/N already exists, I'd preserve it all the way through the pipeline:

```
Client Parser
        ↓
ClientRecord
        ↓
Matching Engine
        ↓
MatchingResult
        ↓
Duplicate Review
        ↓
Report Export
```

That means every matched, unmatched, and duplicate record carries its original S/N. It becomes invaluable for tracing records back to the source workbook and makes debugging or verifying results much easier.

So yes, I recommend using the **S/N** as the unique identifier rather than the candidate name. It's more robust and aligns naturally with how the client data is already structured.


# ################
That's actually useful information, and I'd design Idotte around it.

Since you've mostly seen **printed client lists**, we shouldn't assume the Excel files will always be perfectly formatted.

I wouldn't hard-code `"S/N"` as the only accepted header. Instead, I'd introduce **header aliases**.

For example:

```ts
export const CLIENT_HEADERS = {
  SERIAL_NUMBER: [
    "S/N",
    "SN",
    "S. No",
    "Serial No",
    "Serial Number",
    "No."
  ],

  NAME: [
    "Name",
    "Full Name",
    "Candidate Name"
  ],
} as const;
```

Then the parser can look for the **first matching alias** instead of one exact string.

### Why this is better

Imagine three LGAs send files:

| LGA      | Header    |
| -------- | --------- |
| Agege    | S/N       |
| Alimosho | SN        |
| Badagry  | Serial No |

All three import successfully without anyone needing to edit the workbook.

---

### It also prepares us for OCR

Remember, one of the planned features is:

* Upload scanned client lists
* OCR extraction

OCR is rarely perfect. It may produce:

```
S/N
```

or

```
SN
```

or

```
S.No
```

A parser that accepts aliases will be much more resilient.

---

## My recommendation

I wouldn't stop at aliases. I'd introduce a small utility like:

```
src/utils/header-matcher.ts
```

with something like:

```ts
findHeaderColumn(
  headerMap,
  CLIENT_HEADERS.SERIAL_NUMBER
)
```

Then **every parser** (Allocation, Client, OCR) uses the same logic.

That keeps the parsing code clean and gives us one place to improve header matching in the future (aliases, case-insensitive matching, fuzzy matching, etc.).

---

So I'd treat this as **Phase 2 parser hardening**, not something we need before continuing with the UI.

For now, if your current test workbook uses **`S/N`**, hard-code that so we can keep building. Once the end-to-end workflow is complete, we'll come back and make the parsers resilient to real-world workbook variations. That way, we don't slow down progress on the core placement workflow.


-- IF S/N is missing in client list (soft copy). Simply assign S/N col or id to the candidates.. I have not seen what a client soft copy looks like but i have seen S/N col on the printed hard copy