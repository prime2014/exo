from pyexpat import model
from django import forms
from django.forms import Form


class FileUploadForm(Form):
    file = forms.FileField()

    def save(self, *args, **kwargs):
        pass
