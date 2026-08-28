---
name: Responsive table containment
description: How to keep intentionally wide data tables from creating page-level mobile overflow.
---

Wrap intentionally wide tables in a local horizontal scroller that also establishes inline-size containment. `overflow-x: auto` alone may not stop a wide table's min-content size from widening an ancestor.

**Why:** Mobile QA showed a 700px table still increasing document width even though its immediate wrapper had horizontal overflow enabled. Adding inline-size containment kept scrolling local without masking unrelated page defects.

**How to apply:** For dense comparison or ownership tables that must retain column structure, give the wrapper an explicit bounded width, local horizontal scrolling, and `contain: inline-size`. Keep page-level overflow visible during QA.