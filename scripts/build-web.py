from pathlib import Path
import shutil,json
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'web'
OUT.mkdir(exist_ok=True)
shutil.copytree(ROOT/'web-src/shared',OUT/'shared',dirs_exist_ok=True)
registry=json.loads((ROOT/'data/literary-devices.json').read_text())
assert len({d['id'] for d in registry})==len(registry)
assert all(len(d['examples'])==3 for d in registry)
(OUT/'shared/literary-devices.js').write_text('export const LITERARY_DEVICES = '+json.dumps(registry,ensure_ascii=False,indent=1)+';\nexport const DEVICE_BY_ID = new Map(LITERARY_DEVICES.map(d=>[d.id,d]));\n')
src=ROOT/'assets/www'
shutil.copytree(src/'images',OUT/'images',dirs_exist_ok=True)
(OUT/'audio').mkdir(exist_ok=True)
for file in (ROOT/'assets/www').glob('*.mp3'):shutil.copy2(file,OUT/'audio'/file.name)
(OUT/'problems.js').write_text('\n'.join(line.rstrip() for line in (src/'ProbFile/problems.js').read_text().splitlines())+'\n')
text=(ROOT/'web-src/template.html').read_text().replace('../shared/','shared/').replace('</head>','<link rel="stylesheet" href="shared/song.css"></head>')
text=text.replace('</body>','<script src="problems.js"></script><script type="module" src="shared/app.js"></script></body>')
(OUT/'index.html').write_text(text)
p=OUT/'shared/studio.css';p.write_text(p.read_text().replace('../edubeats/images/','../images/'))
print('Built standalone web app in web/')
