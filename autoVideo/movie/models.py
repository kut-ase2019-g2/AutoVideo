from django.db import models
from datetime import datetime

# Create your models here.
TEXT_TAG_CHOICES = (
    ('SchoolLife', '大学生活'),
    ('Lab', '研究室'),
    ('Shop', '学食'),
)

class Image(models.Model):
    """画像"""
    image = models.ImageField(verbose_name='画像ファイル', upload_to='image/', null=False)
    text_tag = models.CharField(verbose_name='テキストタグ', max_length=50, null=False, choices=TEXT_TAG_CHOICES)
    effect_tag = models.CharField(verbose_name='エフェクトタグ', max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(verbose_name='作成日時', null=False, default=datetime.now())
    updated_at = models.DateTimeField(verbose_name='更新日時', null=False, default=datetime.now())


class Music(models.Model):
    """音楽"""
    music = models.FileField(verbose_name='音楽ファイル', upload_to='music/', null=False)
    created_at = models.DateTimeField(verbose_name='作成日時', null=False, default=datetime.now())
    updated_at = models.DateTimeField(verbose_name='更新日時', null=False, default=datetime.now())


class Movie(models.Model):
    """動画"""
    movie = models.FileField(verbose_name='動画ファイル', upload_to='movie/', null=False)
    created_at = models.DateTimeField(verbose_name='作成日時', null=False, default=datetime.now())
    updated_at = models.DateTimeField(verbose_name='更新日時', null=False, default=datetime.now())


# class Photo(models.Model):
#     # file = models.FileField('ファイル')
#     image = models.ImageField(upload_to='plays')
#     created_at = models.DateTimeField('作成日時', null=False, default=datetime.now())
#     tag_name = models.TextField('タグ名称', null=True)
#     tag_ruby = models.TextField('タグ振り仮名', null=True)
