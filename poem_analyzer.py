#!/usr/bin/env python3
"""Simple Russian poem analysis utility."""
import argparse
import re
from collections import defaultdict

VOWELS = 'аеёиоуыэюя'


def count_syllables(line: str) -> int:
    """Approximate syllable count by counting vowels."""
    return len(re.findall(f'[{VOWELS}]', line.lower()))


def extract_last_stressed(line: str):
    """Return the last vowel and the rhyme part from that vowel to end."""
    for idx in range(len(line) - 1, -1, -1):
        ch = line[idx].lower()
        if ch in VOWELS:
            return ch, line[idx:].lower()
    return '', ''


def rhyme_scheme(parts):
    mapping = {}
    scheme = []
    next_code = ord('A')
    for part in parts:
        if part in mapping:
            scheme.append(mapping[part])
        else:
            mapping[part] = chr(next_code)
            scheme.append(chr(next_code))
            next_code += 1
    return ''.join(scheme)


def guess_meter(syllables):
    if not syllables:
        return None
    avg = sum(syllables) / len(syllables)
    if int(avg) % 2 == 0:
        return 'Похоже на хорей или ямб'
    return 'Размер не определён'


def analyze(text: str):
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    syllables = [count_syllables(line) for line in lines]
    last_vowels = []
    rhyme_parts = []
    for line in lines:
        v, part = extract_last_stressed(line)
        last_vowels.append(v)
        rhyme_parts.append(part)
    scheme = rhyme_scheme(rhyme_parts)
    groups = defaultdict(list)
    for i, part in enumerate(rhyme_parts):
        groups[part].append(i + 1)
    pairs = []
    for indices in groups.values():
        for i in range(0, len(indices) - 1, 2):
            pairs.append((indices[i], indices[i + 1]))
    meter = guess_meter(syllables)
    return {
        'lines': len(lines),
        'avg_syllables': sum(syllables) / len(syllables) if lines else 0,
        'last_vowels': last_vowels,
        'rhyme_pairs': pairs,
        'scheme': scheme,
        'meter_hint': meter,
    }


def main():
    parser = argparse.ArgumentParser(description='Analyze Russian poetry.')
    parser.add_argument('file', help='Path to text file with poem')
    args = parser.parse_args()
    with open(args.file, encoding='utf-8') as f:
        text = f.read()
    result = analyze(text)
    print('Число строк:', result['lines'])
    print('Среднее количество слогов на строку:', f"{result['avg_syllables']:.2f}")
    print('Последние гласные:', ' '.join(result['last_vowels']))
    print('Предполагаемые пары рифм:', result['rhyme_pairs'])
    print('Схема рифмовки:', result['scheme'])
    if result['meter_hint']:
        print('Размер:', result['meter_hint'])


if __name__ == '__main__':
    main()
