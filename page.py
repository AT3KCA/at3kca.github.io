class Page:
	'''
	template	是一个字符串，作为传入的模板，按理说这个模板是根页面
	'''
	def __init__(self, template):
		self.template = template
	
	'''
	target		是我们要替换的占位符，比如{{children}}
	padding		是填充的内容，可以是下一个模板
	'''
	def replaceTemplate(self, target, padding):
		self.template = self.template.replace(target, padding)
	

	'''
	为预处理模板提供方案
	'''
	def renderTemplate(self):
		return self.template
