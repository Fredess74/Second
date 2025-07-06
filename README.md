# Poem Analyzer

This repository contains a simple console utility `poem_analyzer.py` for analyzing Russian poetry.

## Usage

```
python poem_analyzer.py path/to/poem.txt
```

The script outputs:

- The number of lines in the poem.
- Average syllables per line.
- Last vowels (approximated stressed vowels) for each line.
- Suggested rhyme pairs and the rhyme scheme.
- A rough hint at the poetic meter.

The implementation relies only on the Python standard library.
