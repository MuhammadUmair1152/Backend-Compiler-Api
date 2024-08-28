const detectFunctionType = (path) => {
    const { node, parent } = path;
    const types = [];
    // Basic function types
    if (!path.isFunction()) return 'N/A';
    if (path.isArrowFunctionExpression()) types.push('Arrow Function');
    if (path.isFunctionDeclaration()) types.push('Function Declaration');
    if (path.isFunctionExpression()) types.push('Function Expression');
    if (!node.id) types.push('Anonymous Function');
    // Function characteristics
    if (parent.type === 'CallExpression' && parent.callee === node) types.push('IIFE');
    if (node.generator) types.push('Generator Function');
    if (node.async) types.push('Async Function');
    if (parent.type === 'MethodDefinition' && parent.kind === 'constructor') types.push('Constructor Function');
    if (parent.type === 'ObjectMethod' || parent.type === 'ClassMethod') types.push('Method Function');
    if (parent.type === 'CallExpression') types.push('Callback Function');
     // Safely check for params
    if (node.params && node.params.some(param => param.type === 'Identifier' && path.scope.getBinding(param.name)?.path.isFunction())) {
        types.push('Higher-Order Function');
    }
    if (node.params && node.params.some(param => param.type === 'RestElement')) {
        types.push('Rest Parameter Function');
    }
    if (node.params && node.params.some(param => param.type === 'AssignmentPattern')) {
        types.push('Default Parameter Function');
    }
    if (parent.type === 'ObjectMethod' && (parent.kind === 'get' || parent.kind === 'set')) types.push('Getter/Setter Function');
    // Check for recursion and curried functions
    if (path.isFunction()) {
        const functionName = node.id ? node.id.name : null;
        const isRecursive = functionName && path.scope.getBinding(functionName)?.referencePaths.some(refPath => refPath.findParent(p => p === path));
        if (isRecursive) types.push('Recursive Function');

        const isCurried = node.body.body?.some(statement => statement.type === 'ReturnStatement' && statement.argument.type.includes('Function'));
        if (isCurried) types.push('Curried Function');

        const isClosure = Object.values(path.scope.getAllBindings()).some(binding =>
            binding.referencePaths.some(refPath => refPath.findParent(p => p !== path && p.isFunction()))
        );
        if (isClosure) types.push('Closure');
    }

    return types.join(', ') || 'N/A';
};

module.exports = { detectFunctionType };
