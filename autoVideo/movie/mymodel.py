import csv, random
import glob
import sys
from clarifai.rest import ClarifaiApp
from tqdm import tqdm
import datetime

def main(api_key, image_list, outpath):
    # 乱数シード値
    random.seed(1)
    api_key=api_key
    max_concepts=200
    min_value=0.0
    # all_image_list = glob.glob('image/*.*')
    #image_list = all_image_list
    image_list_random = random.sample(image_list, 10)

    # fileの書き出し setup
    f_AI = open(outpath+'/tag_data.csv', 'w')
    w_AI = csv.writer(f_AI, lineterminator='\n')

    # API setup
    app = ClarifaiApp(api_key=api_key)
    model = app.models.get('AutoEffectTagSet')

    # API DO
    pbar = tqdm(total=len(image_list_random), desc='uploaded')
    for i in range(len(image_list_random)):
        response = model.predict_by_filename(image_list_random[i], max_concepts=max_concepts)
        rList = response['outputs'][0]['data']['concepts']
        w_AI.writerow([str(image_list_random[i])] + [str(rList[0]['name'])])
        pbar.update(1)
    pbar.close()


def oneEffect(api_key, image):
    # 乱数シード値
    random.seed(1)
    api_key=api_key
    max_concepts=200
    min_value=0.0

    # API setup
    app = ClarifaiApp(api_key=api_key)
    model = app.models.get('AutoEffectTagSet')

    response = model.predict_by_filename(image, max_concepts=max_concepts)
    rList = response['outputs'][0]['data']['concepts']
    return str(rList[0]['name'])
