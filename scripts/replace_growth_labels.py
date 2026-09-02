from pathlib import Path
files = list(Path('Frontend/src/pages/Services').glob('*.jsx'))
replacements = {
    'Growth Package': 'Standard Package',
    'Growth Application': 'Standard Application',
    'Growth Care': 'Standard Care',
    'Growth VA': 'Standard VA',
    'Growth PM Support': 'Standard PM Support',
    'Growth Design Package': 'Standard Design Package',
    'Growth Identity': 'Standard Identity',
    'Growth Campaign': 'Standard Campaign',
    'Growth Lead Generation': 'Standard Lead Generation',
    'Growth Automation': 'Standard Automation',
    'Growth Analytics': 'Standard Analytics',
    'Growth tier social media management': 'Standard tier social media management',
    'Everything in Growth': 'Everything in Standard',
    "packageName: 'Growth Package'": "packageName: 'Standard Package'",
    'packageName: "Growth Package"': 'packageName: "Standard Package"',
}
for p in files:
    s = p.read_text(encoding='utf-8')
    orig = s
    for old, new in replacements.items():
        s = s.replace(old, new)
    if s != orig:
        p.write_text(s, encoding='utf-8')
        print(f'updated {p}')
    else:
        print(f'no change {p}')
