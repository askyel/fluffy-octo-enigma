import re
import numpy as np
from collections import Counter
from nltk.corpus import stopwords

CUTOFF = 7

filename = 'candidates.lis'
files = np.loadtxt(filename, dtype='str')

stop = stopwords.words('english')

for k in range(len(files)):
    txt = open(files[k]).read()
    
    words = re.findall('\w+', open(files[k]).read().lower())
    w =  Counter(words).items()
    
    name = files[k][files[k].find('/')+1 : files[k].find('.txt')]
    json = 'json/' + name + '.json'
    f = open(json, 'w')
    f.write('{\n"name": "'+name+'",\n"children": [\n')
    for i in w:
        if i[0] not in stop and i[1] > CUTOFF and len(i[0]) > 2:
            f.write('{"name": "'+i[0]+'", "size": '+str(i[1])+'},\n')
#    if w[-1][0] not in stop and i[1] > CUTOFF and len(w[-1][0]) > 2:
#        f.write('{"name": "'+w[-1][0]+'", "size": '+str(w[-1][1])+'}\n')
    f.write('{}]\n}')
