import os
import bpy
import json

# this script uesd to extract hierarchy collection form blender "scripting"
# in ztree json form

rootScene = bpy.context.scene.collection
strucDic = {}
strucDic['name'] = rootScene.name_full
strucDic['children'] = []
indexingList = []
tempCurrDicColls = strucDic['children']
tempLastDicColls = strucDic
subCollsIndex = 0


def exhaustColl(colls):
    global indexingList, tempCurrDicColls, subCollsIndex, tempLastDicColls

    if len(colls.children) == 0:
        print("==lowest==")
        # reach lowest level,this collection has objects only

        for obj in colls.objects:
            tempCurrDicColls.append({'name': obj.name_full})

        # move up 1 level
        tempDic = strucDic
        for keyIndex in indexingList[0:-1]:
            tempDic = tempDic['children'][keyIndex]

        tempCurrDicColls = tempDic['children']
        indexingList = indexingList[0:-1]

        # if(colls.name_full == "拳套"):
        #     print("tempCurrDicColls", tempCurrDicColls)
        #     os._exit()

        return

    for subCollsIndex in range(len(colls.children)):
        subColls = colls.children[subCollsIndex]
        print('======{}======'.format(subColls.name_full))
        indexingList.append(subCollsIndex)
        tempCurrDicColls.append({'name': subColls.name_full, 'children': []})
        # print("LINE_39:",tempCurrDicColls,subCollsIndex)
        # TODO add a last level
        # tempLastDicColls=tempCurrDicColls
        # go down
        print("indexingList", indexingList)
        tempCurrDicColls = tempCurrDicColls[subCollsIndex]['children']
        exhaustColl(subColls)
        # check if is last subColls of children
        if(subCollsIndex == len(colls.children)-1):
            print("-------------last one-------------")
            # append reset obj
            for obj in colls.objects:
                tempCurrDicColls.append({'name': obj.name_full})
            # move up 1 level
            tempDic = strucDic
            for keyIndex in range(len(indexingList[0:-1])):
                tempDic = tempDic['children'][keyIndex]

            # print(indexingList)
            indexingList = indexingList[0:-1]
            tempCurrDicColls = tempDic['children']


exhaustColl(rootScene)

# on windows
with open('{}\\data.json'.format(os.path.dirname(bpy.data.filepath)), 'w') as fp:
    json.dump(strucDic, fp, ensure_ascii=False)
# print(strucDic)
