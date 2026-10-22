"""Generate four editable RenderCV YAML sources from the shared public profile."""
import json
from pathlib import Path
from ruamel.yaml import YAML

root = Path(__file__).resolve().parent.parent
data = json.loads((root / 'resume/profiles.json').read_text(encoding='utf-8'))
sources = root / 'resume/source'
sources.mkdir(exist_ok=True)
yaml = YAML()
yaml.width = 110
yaml.default_flow_style = False
for profile in data['profiles']:
    projects = []
    for key in profile['projects']:
        project = data['projects'][key]
        projects.append({'name': '[' + project['name'] + '](https://irfanfahmi.com/projects/' + key + '/)', 'highlights': project['highlights']})
    cv = {
        'name': data['name'], 'headline': profile['headline'],
        'location': data['location'], 'email': data['email'],
        'website': profile['portfolio'],
        'social_networks': [{'network':'LinkedIn','username':'mifi99'}, {'network':'GitHub','username':'l3al3y'}],
        'sections': {
            'Professional Summary': [profile['summary']],
            'Education': data['education'],
            'Technical Skills': profile['skills'],
            'Selected Projects': projects,
            'Technical Experience': data['experience'],
            'Professional Registrations': data['registrations'],
            'Selected Training': data['training'],
            'Languages': ['Bahasa Malaysia (native); English (professional working proficiency).']
        }
    }
    document = {
        'cv': cv,
        'design': {
            'theme':'engineeringresumes',
            'page': {'size':'a4','top_margin':'1.35cm','bottom_margin':'1.35cm','left_margin':'1.5cm','right_margin':'1.5cm','show_footer':False,'show_top_note':False},
            'colors': {'body':'#1c2630','name':'#14324d','headline':'#14324d','section_titles':'#14324d','links':'#185a80','connections':'#34495b'},
            'typography': {'font_family':'Source Sans 3','font_size':{'body':'10pt','name':'22pt','headline':'10.5pt','connections':'9pt','section_titles':'11pt'},'alignment':'left','line_spacing':'0.48em'},
            'header': {'space_below_name':'0.12cm','space_below_headline':'0.15cm','space_below_connections':'0.18cm','connections':{'show_icons':False,'separator':'|','space_between_connections':'0.25cm'}},
            'section_titles':{'space_above':'0.28cm','space_below':'0.13cm'},
            'sections':{'space_between_regular_entries':'0.15cm','space_between_text_based_entries':'0.08cm'},
            'entries':{'date_and_location_width':'3.1cm','space_between_columns':'0.2cm','highlights':{'space_above':'0.04cm','space_between_items':'0.03cm','space_left':'0cm'}}
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
