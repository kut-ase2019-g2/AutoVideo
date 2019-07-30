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

# Create your views here.

class IndexView(generic.TemplateView):
    template_name = 'movie/index.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["title"] = "MyPage"
        return context


# def Wait(self, request, *args, **kwargs):



class WaitView(generic.TemplateView):
    template_name = 'movie/wait.html'

    # def get(key=''):
    #     useimage_record = Image.objects.filter(text_tag=self.kwargs.get('key')).order_by('created_at').reverse()[:10] #上位10件
    # #     for record in useimage_record:
    # #         print(record.Image)
    #     # Image.objects.order_by('created_at').reverse()
    #     return

    def get(self, request, *args, **kwargs):
        context = self.get_context_data(**kwargs)
        return self.render_to_response(context)


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["key"] = self.kwargs.get('key')
        useimage_record = Image.objects.filter(text_tag=self.kwargs.get('key')).order_by('created_at')[:10] #上位10件
        # for record in useimage_record:
        #     print(record.image)
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
        # print(str(image_list[i]) +': ' + str(effect_list[i]))





    #タグ生成
    # mymodel.main(api_key=settings.CLARIFAI_API_KEY, image_list=image_list, outpath=settings.CSV_URL)
    # 動画生成

    return redirect('movie:index')


class PlayView(generic.TemplateView):
    template_name = 'movie/play.html'

# class ImageCreateView(generic.View):
#     template_name = 'movie/imageCreate.html'
#     form_class = ImagesForm
#
#
#     def get(self, request, *args, **kwargs):
#         form = self.form_class()
#         return render(request, self.template_name, {'form': form})
#
#
#     def post(self, request, *args, **kwargs):
#         form = self.form_class(request.POST)
#         print(self)
#         if form.is_valid():
#             return redirect('movie:newImage', kwargs={'image': form.image})
#         return render(request, self.template_name, {'form': form})


class ImageCreateView(generic.CreateView):
    template_name = 'movie/imageCreate.html'
    model = Image
    # form_class = ImagesForm
    fields = ['text_tag', 'image']
    # fields = "__all__"

    def get_success_url(self):
        # print(reverse('movie:newImage', kwargs={'image': self.object.image}))
        # return reverse('movie:newImage', kwargs={'image': self.object.image})
        return reverse('movie:newImage', kwargs={'pk':self.object.pk})
    # success_url = reverse_lazy('base:top')


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

# class WaitKeyView(generic.TemplateView):
#     template_name = 'movie/wait.html'

    # def main(self):
    #     return HttpResponse("Hello, world.")
