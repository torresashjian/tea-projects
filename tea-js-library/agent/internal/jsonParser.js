var agentExtenderDetailsReplacer = function (key, value){
    if (key === '' && value && typeof value === 'object') {
        var replacer = {};
        for (var k in value) {
            if(k === 'machineId'){
                replacer['machineid'] = value['machineId'];
            } else if(k === 'indexEnabled'){
                replacer['index-enabled'] = value['indexEnabled'];
            } else if(k === 'libraryVersion'){
                replacer['library-version'] = value['libraryVersion'];
            } else if(k === 'exposePythonAPI'){
                replacer['expose-python-API'] = value['exposePythonAPI'];
            } else {
                replacer[k] = value[k];
            }
        }
        return replacer;
    }  else if (key === 'objectType' && value && typeof value === 'object') {
        var replacerArr = [];
        for (var k in value) {
            var replacer = {};
            var objectType = value[k];
            for (var otk in objectType){
                if(otk === 'specialTypes'){
                    replacer['special-types'] = objectType['specialTypes'];
                } else if(otk === 'hasChildren'){
                    replacer['has-children'] = objectType['hasChildren'];
                } else if(otk === 'hasConfig'){
                    replacer['has-config'] = objectType['hasConfig'];
                } else if(otk === 'hasStatus'){
                    replacer['has-status'] = objectType['hasStatus'];
                } else if(otk === 'sharedOwnership'){
                    replacer['shared-ownership'] = objectType['sharedOwnership'];
                } else {
                    replacer[otk] = objectType[otk];
                }
            }
            replacerArr.push(replacer);
        }
        return replacerArr;
    } else if (key === 'operation' && value && typeof value === 'object') {
        var replacerArr = [];
        for (var k in value) {
            var replacer = {};
            var operation = value[k];
            for (var opk in operation){
                if(opk === 'uriTemplate'){
                    replacer['uri-template'] = operation['uriTemplate'];
                } else if(opk === 'returnValue'){
                    replacer['return-value'] = operation['returnValue'];
                } else if(opk === 'returnSchema'){
                    replacer['return-schema'] = operation['returnSchema'];
                } else if(opk === 'httpMethod'){
                    replacer['http-method'] = operation['httpMethod'];
                } else {
                    replacer[opk] = operation[opk];
                }
            }
            replacerArr.push(replacer);
        }
        return replacerArr;
    }  else if (key === 'parameter' && value && typeof value === 'object') {
        var replacerArr = [];
        for (var k in value) {
            var replacer = {};
            var parameter = value[k];
            for (var pk in parameter){
                if(pk === 'multiValued'){
                    replacer['multi-valued'] = parameter['multiValued'];
                } else {
                    replacer[pk] = parameter[pk];
                }
            }
            replacerArr.push(replacer);
        }
        return replacerArr;
    }
    return value;
}

exports.getAgentExtenderDetailsReplacer = function(){
    return agentExtenderDetailsReplacer;
};


