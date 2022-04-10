import os
import bpy
import json
# this script uesd to extract hierarchy collection form blender "scripting" 
rootScene = bpy.context.scene.collection
strucDic = {}
strucDic[rootScene.name_full] = {'colls': {}, "objects": []}
indexingList = [rootScene.name_full]
tempCurrDicColls=strucDic[rootScene.name_full]['colls']

def exhaustColl(colls):
    global indexingList
    global tempCurrDicColls
    if len(colls.children) == 0:
        # reach lowest level,this collection has objects only
        tempDic = strucDic
        for key in indexingList[0:-1]:
            tempDic = tempDic[key]['colls']
        #move up 1 level
        tempCurrDicColls=tempDic
        for obj in colls.objects:
            tempDic[colls.name_full]['objects'].append(obj.name_full)
        indexingList = indexingList[0:-1]
        return

    for subColls in colls.children:
        print('======{}======'.format(subColls.name_full))
        indexingList.append(subColls.name_full)
        tempCurrDicColls[subColls.name_full]={'colls': {}, "objects": []}
        tempCurrDicColls=tempCurrDicColls[subColls.name_full]['colls']
        exhaustColl(subColls)
        #check if is last subColls of children
        if(subColls.name==colls.children[-1].name):
            #move up 1 level            
            tempDic = strucDic
            for key in indexingList[0:-1]:
                tempDic = tempDic[key]['colls']
            #append reset obj
            for obj in colls.objects:
                tempDic[colls.name_full]['objects'].append(obj.name_full)

            indexingList = indexingList[0:-1]
            print(indexingList)
            tempCurrDicColls=tempDic
            
exhaustColl(rootScene)

#on windows
with open('{}\\data.json'.format(os.path.dirname(bpy.data.filepath)), 'w') as fp:
    json.dump(strucDic, fp,ensure_ascii=False)
# print(strucDic)