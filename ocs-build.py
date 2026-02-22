import markdown
import os
import frontmatter
from datetime import datetime
import yaml
import page

config = yaml.load(open('config.yml', 'r', encoding = 'utf-8'), Loader = yaml.FullLoader)
print(config)

class linkPage:
	def __init__(self, file_path, md_name, output_url, output_file, meta, content):
		self.file_path = file_path
		self.md_name = md_name
		self.output_url = output_url
		self.output_file = output_file
		self.meta = meta
		self.content = content


def readFile(name):
	file = open(name, 'r', encoding = 'utf-8')
	content = file.read()
	file.close()
	return content

def writeFile(name, content):
	dirname = os.path.dirname(name)
	if dirname:
		os.makedirs(dirname, exist_ok = True)
	file = open(name, 'w', encoding = 'utf-8')
	file.write(content)
	file.close()

def parse_date(date_str):
    """尝试将多种格式的日期字符串解析为 datetime 对象"""
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%Y-%m-%d", "%Y/%m/%d"):
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    # 如果所有格式都失败，返回一个最小日期（保证排在最后）
    return datetime.min

'''
readAllTemplate函数把路径下的所有html读取并以键值对的形式返回
'''
def readAllTemplate(path = '_template'):
	templateMap = {}
	for file in os.listdir(path):
		template_name = file[:file.find('.html')]
		template_file = '%s/%s' % (path, file)
		template = readFile(template_file)
		templateMap[template_name] = page.Page(template).template
		print('Prepared template \'%s\' in %s' % (template_name, template_file))
	return templateMap

def isDir(path):
	return os.path.isdir(path)

def prepareArchive(inPath = '_documents', outPath = '_archives'):
	result = []
	md = markdown.Markdown(extensions=['extra','meta','pymdownx.tasklist','pymdownx.tilde'])
	for file in os.listdir(inPath):
		full_path = os.path.join(inPath, file)
		if isDir(full_path):
			print('检测到文件夹 \'%s\', 尚不支持处理, 已跳过' % (full_path))
			continue
		if file.startswith('__'):
			print('检测到双下划线开头文档 \'%s\', 识别为特殊文档, 已跳过' % (full_path))
			continue
		md_name = '%s'% (file[:-3])
		output_file = '%s/%s/index.html' % (outPath, md_name)
		output_url = '/%s/%s' % (outPath, md_name)
		input_path = '%s/%s' % (inPath, md_name)
		md_fm = frontmatter.loads(readFile(full_path))
		meta = md_fm.metadata
		md_html = md.convert(md_fm.content)
		link_page = linkPage(full_path, md_name, output_url, output_file, meta, md_html)
		result.append(link_page)
	return result

def buildArchive(archives = [], outPath = '_archives', pagesMap= {}):
	name_urlMap = []
	# 看着类补全构建函数 准备函数获取了所有的数据
	for link_page in archives:
		rootTemplate = pagesMap['template'].renderTemplate()
		contentTemplate = pagesMap['content'].renderTemplate()
		contentTemplate = contentTemplate.replace('{{children}}', link_page.content)
		rootTemplate = rootTemplate.replace('{{children}}', contentTemplate)
		print('导出 %s in url %s <-> ' % (link_page.file_path, link_page.output_url), end='')
		name_urlMap.append(link_page)
		writeFile(link_page.output_file, rootTemplate)
		print('done')
	return name_urlMap

def buildArchiveHome(outPath, name_urlList, pagesMap):
	rootTemplate = pagesMap['template'].renderTemplate()
	template = pagesMap['archivelink'].renderTemplate()
	elements = ""
	name_urlList.sort(key=lambda item: parse_date(item.meta.get('date', '')), reverse=True)
	for key in name_urlList:
		singleTemplate = template.replace('{{name}}', key.meta.get('title', key.md_name))
		singleTemplate = singleTemplate.replace('{{description}}', key.meta.get('description', ''))
		singleTemplate = singleTemplate.replace('{{link}}', key.output_url)
		singleTemplate = singleTemplate.replace('{{date}}', key.meta.get('date',''))
		elements += singleTemplate
	
	rootTemplate = rootTemplate.replace('{{children}}', elements)
	print('创建文章导航页 %s/index.html <-> ' % (outPath), end='')
	writeFile('%s/index.html' % (outPath), rootTemplate)
	print('done')

def markdown2single(mdPath, output, name, pagesMap):
	md = markdown.Markdown(extensions=['extra','meta','pymdownx.tasklist','pymdownx.tilde'])
	md_text = readFile(mdPath)
	md_fm = frontmatter.loads(md_text)
	html = md.convert(md_fm.content)
	meta = md_fm.metadata
	content = pagesMap['content'].renderTemplate().replace('{{children}}', html)
	padding = pagesMap['template'].renderTemplate().replace('{{children}}', content).replace('{{title}}', name)
	print('Create single in %s %s <-> ' % (name, output), end='')
	writeFile(output, padding)
	print('done')

def getAllPage(templateMap):
	resultMap = {}
	for key in templateMap:
		resultMap[key] = page.Page(templateMap[key])
	return resultMap

def preLoadPage(name, replaceMap, pagesMap):
	for key in replaceMap:
		pagesMap[name].replaceTemplate(key, replaceMap[key])

# readAllTemplate(path)
# buildArchives(inPath, outPath, templateMap, template_name):
# createArchiveHome(archivesPath, linkMap , templateMap ,page_template ,link_template):

templateMap = readAllTemplate()

pagesMap = getAllPage(templateMap)

leftbarMap = {'{{name}}': 'AT3K_CA', '{{motd}}': 'Hello world!', '{{email}}': 'at3kgamesoft@163.com', '{{bilibili}}': 'https://space.bilibili.com/1856254417'}
preLoadPage('leftbar', leftbarMap, pagesMap) # 加载leftbar

rootpageMap = {'{{leftbar}}': pagesMap['leftbar'].renderTemplate()}
preLoadPage('template', rootpageMap, pagesMap)

archives = prepareArchive()
name_urlMap = buildArchive(archives, '_archives', pagesMap)

buildArchiveHome('_archives', name_urlMap, pagesMap)

markdown2single('_documents/__ocs_home.md', 'index.html', 'Home', pagesMap)
markdown2single('_documents/__ocs_about.md', 'about/index.html', 'About', pagesMap)
# ===

