import webapp2

from base import BaseHandler


class IndexPage(BaseHandler):
    def get(self):
        self.render('/templates/index.html')


app = webapp2.WSGIApplication([
    (r'/', IndexPage)
], debug=True)
