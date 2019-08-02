from multiprocessing import Process
from django.conf import settings
# from django.shortcuts import redirect
from django.shortcuts import render, redirect
from django.views import generic
from .models import Image
from . import mymodel
import os
from .forms import ImagesForm
from django.urls import reverse
import csv
import subprocess
import time
import shutil

# Create your views here.

class IndexView(generic.TemplateView):
    template_name = 'movie/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["title"] = "MyPage"
        return context

class WaitView(generic.TemplateView):
    template_name = 'movie/wait.html'

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["key"] = self.kwargs.get('key')
        useimage_record = Image.objects.filter(text_tag=self.kwargs.get('key')).order_by('created_at')[:10] #上位10件
        return context


def movieMake(request, key):
    useimage_record = Image.objects.filter(text_tag=key).order_by('created_at')[:10] #上位10件
    image_list = [os.path.join(settings.MEDIA_ROOT, str(record.image)) for record in useimage_record ]
    effect_list = [str(record.effect_tag) for record in useimage_record ]
    os.makedirs(settings.CSV_URL, exist_ok=True)
    with open(settings.CSV_URL+'/tag_data_.csv', 'w') as f_AI:
        w_AI = csv.writer(f_AI, lineterminator='\n')
        for i in range(10):
            w_AI.writerow([image_list[i]] + [effect_list[i]])


    if os.path.exists(os.path.join(settings.MEDIA_ROOT, 'movie/test_bgm_ai.mp4')):
        os.remove(os.path.join(settings.MEDIA_ROOT, 'movie/test_bgm_ai.mp4'))
    if os.path.exists(os.path.join(settings.MEDIA_ROOT, 'movie/result2.mp4')):
        os.remove(os.path.join(settings.MEDIA_ROOT, 'movie/result2.mp4'))

    os.system(settings.JSX_PASS)
    print('===== Encoder =====')
    time.sleep(40)
    os.system(settings.FFMPEG_COMMAND)
    time.sleep(2)
    return redirect('movie:play_key',key)


class PlayView(generic.TemplateView):
    template_name = 'movie/play.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["key"] = self.kwargs.get('key')
        context["video"] = settings.PLAY_VIDOE
        return context


class ImageCreateView(generic.CreateView):
    template_name = 'movie/imageCreate.html'
    model = Image
    # form_class = ImagesForm
    fields = ['text_tag', 'image']
    # fields = "__all__"

    def get_success_url(self):
        return reverse('movie:newImage', kwargs={'pk':self.object.pk})


class NewImageView(generic.TemplateView):
    template_name = 'movie/newimage.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        record = Image.objects.get(pk=self.kwargs.get('pk'))
        context["image"] = record.image
        context["text_tag"] = record.text_tag
        os.makedirs(settings.CSV_URL, exist_ok=True)
        #タグ生成
        image = os.path.join(settings.MEDIA_ROOT, str(record.image))
        effect_tag = mymodel.oneEffect(api_key=settings.CLARIFAI_API_KEY, image=image)
        # 動画生成oneEffect(api_key, image):
        record.effect_tag = effect_tag
        record.save() # レコード更新
        context["effect_tag"] = effect_tag
        return context
