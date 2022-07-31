// 配置文件主要是exports了一个函数
module.exports = function (plop) {
    // controller generator
    plop.setGenerator('controller', {
        description: 'application controller logic',
        prompts: [{
            type: 'input',
            name: 'name',
            message: 'controller name please'
        }],
        actions: [{
            type: 'add',
            path: 'assets/Scripts/Game/UIControllers/{{name}}_Ctrl.ts',
            templateFile: 'plop-templates/controller.hbs'
        }]
    });
};