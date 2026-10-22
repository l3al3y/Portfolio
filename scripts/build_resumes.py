"""Generate four editable RenderCV YAML sources from the shared public profile."""
import json
import re
from pathlib import Path
from ruamel.yaml import YAML

root = Path(__file__).resolve().parent.parent
data = json.loads((root / 'resume/profiles.json').read_text(encoding='utf-8'))
sources = root / 'resume/source'
sources.mkdir(exist_ok=True)
yaml = YAML()
yaml.width = 110
yaml.default_flow_style = False

def plain_text(text):
    # Keep URL and email spelling intact while removing decorative punctuation.
    links = []
    def protect(match):
        links.append(match.group(0))
        return f'LINKTOKEN{len(links)-1}ENDTOKEN'
    text = re.sub(r'\[[^\]]+\]\(https?://[^)]+\)', protect, text)
    text = re.sub(r'https?://[^\s)]+', protect, text)
    text = re.sub(r'(?<=\d),(?=\d{3}\b)', '', text)
    text = text.replace('C/C++', 'C and C++').replace('&', 'and').replace('|', ' ')
    text = text.replace('/', ' and ').replace('%', ' percent')
    text = text.replace('Graduation scheduled:', 'Graduation scheduled for')
    text = text.replace(';', '.').replace(':', '').replace('(', '').replace(')', '')
    text = text.replace(',', '').replace('–', ' to ').replace('—', ' ')
    text = re.sub(r'(?<=\d)-(?=\d)', ' to ', text).replace('-', ' ')
    text = re.sub(r'[ \t]+', ' ', text).strip()
    text = re.sub(r'(?<=\.) ([a-z])', lambda m: ' '+m.group(1).upper(), text)
    for i, link in enumerate(links):
        text = text.replace(f'LINKTOKEN{i}ENDTOKEN', link)
    return text

def clean_entries(entries):
    cleaned=[]
    for entry in entries:
        item={k:plain_text(v) if isinstance(v,str) and k not in ('start_date','end_date') else v for k,v in entry.items() if k!='highlights'}
        if entry.get('highlights'):
            item['summary']=' '.join(plain_text(v) for v in entry['highlights'])
        cleaned.append(item)
    return cleaned

for profile in data['profiles']:
    projects = []
    for key in profile['projects']:
        project = data['projects'][key]
        projects.append({'name': '[' + plain_text(project['name']) + '](https://irfanfahmi.com/projects/' + key + '/)', 'summary': ' '.join(plain_text(v) for v in project['highlights'])})
    cv = {
        'name': data['name'], 'headline': plain_text(profile['headline']),
        'location': plain_text(data['location']), 'email': data['email'],
        'website': profile['portfolio'],
        'social_networks': [{'network':'LinkedIn','username':'mifi99'}, {'network':'GitHub','username':'l3al3y'}],
        'sections': {
            'Professional Summary': [plain_text(profile['summary'])],
            'Education': clean_entries(data['education']),
            'Technical Skills': clean_entries(profile['skills']),
            'Selected Projects': projects,
            'Technical Experience': clean_entries(data['experience']),
            'Professional Registrations': clean_entries(data['registrations']),
            'Selected Training': clean_entries(data['training']),
            'Languages': ['Bahasa Malaysia native. English professional working proficiency.']
        }
    }
    document = {
        'cv': cv,
        'design': {
            'theme':'engineeringresumes',
            'page': {'size':'a4','top_margin':'1.35cm','bottom_margin':'1.35cm','left_margin':'1.5cm','right_margin':'1.5cm','show_footer':False,'show_top_note':False},
            'colors': {'body':'#1c2630','name':'#14324d','headline':'#14324d','section_titles':'#14324d','links':'#185a80','connections':'#34495b'},
            'typography': {'font_family':'Source Sans 3','font_size':{'body':'10pt','name':'22pt','headline':'10.5pt','connections':'9pt','section_titles':'11pt'},'alignment':'left','line_spacing':'0.48em'},
            'header': {'space_below_name':'0.12cm','space_below_headline':'0.15cm','space_below_connections':'0.18cm','connections':{'show_icons':False,'separator':'','space_between_connections':'0.3cm'}},
            'links':{'underline':False,'show_external_link_icon':False},
            'section_titles':{'type':'with_full_line','space_above':'0.23cm','space_below':'0.1cm'},
            'sections':{'space_between_regular_entries':'0.15cm','space_between_text_based_entries':'0.08cm'},
            'entries':{'date_and_location_width':'0cm','space_between_columns':'0cm','summary':{'space_above':'0.03cm'},'highlights':{'space_above':'0.04cm','space_between_items':'0.03cm','space_left':'0cm'}},
            'templates':{'date_range':'START_DATE to END_DATE','one_line_entry':{'main_column':'**LABEL** DETAILS'},'education_entry':{'main_column':'**INSTITUTION** AREA\nDATE\nSUMMARY','date_and_location_column':'','degree_column':None},'experience_entry':{'main_column':'**POSITION** COMPANY\nDATE\nSUMMARY','date_and_location_column':''},'normal_entry':{'main_column':'**NAME**\nSUMMARY','date_and_location_column':''}}
        },
        'locale': {'language':'english','month_abbreviations':['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']},
        'settings': {'current_date':data['updated'],'pdf_title':data['name']+' - '+profile['label'], 'render_command':{'dont_generate_html':True,'dont_generate_markdown':True,'dont_generate_png':True,'pdf_path':'OUTPUT_FOLDER/'+profile['download_name']}}
    }
    with (sources / (profile['id'] + '.yaml')).open('w', encoding='utf-8') as stream:
        yaml.dump(document, stream)
    source_path = sources / (profile['id'] + '.yaml')
    normalized = '\n'.join(line.rstrip() for line in source_path.read_text(encoding='utf-8').splitlines()) + '\n'
    assert yaml.load(normalized) == document
    source_path.write_text(normalized, encoding='utf-8')
print('Generated four RenderCV 2.8 sources from the shared Computer Engineering profile.')
