from django import forms
from .models import Image
#
# TEXT_TAG_CHOICES = (
#     ('SchoolLife', '大学生活'),
#     ('Lab', '研究室'),
#     ('Shop', '学食'),
# )
#
class ImagesForm(forms.ModelForm):
        # image = forms.ImageField()
    class Meta:
        model = Image
        fields = ('image', 'text_tag')
        # widgets = {
        #     'image': forms.ImageField(
        #         label='画像ファイル',
        #     ),
        #     'message': forms.CharField(
        #         label='テキストタグ',
        #     ),
        # }
        # image = forms.ImageField(
        #     label='画像ファイル',
        # )
        #
        # text_tag = forms.CharField(
        #     label='テキストタグ',
        # )
