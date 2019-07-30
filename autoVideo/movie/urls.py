from django.urls import path
from . import views

app_name = 'movie'
urlpatterns = [
    path('', views.IndexView.as_view(), name='index'),
    path('wait/<str:key>', views.WaitView.as_view(), name='wait_key'),
    path('movieMake/<str:key>', views.movieMake, name='movieMake_key'),
    path('movieMake/', views.movieMake, name='movieMake'),
    path('play/<str:key>', views.WaitView.as_view(), name='play'),
    path('imageCreate', views.ImageCreateView.as_view(), name='imageCreate'),
    path('newImage/<int:pk>', views.NewImageView.as_view(), name='newImage'),
    # path('newImage', views.NewImageView.as_view(), name='newImage'),
]
