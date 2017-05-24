[U dont Know JS Notes](https://github.com/getify/You-Dont-Know-JS)



# Scope & Closures
+ _components_ 
    + _engine_ 
        + search for variable within scope, 
    + _compiler_ 
        + tokenizing/lexing 
        + parsing: takes tokens into AST (abstract syntax tree) representing grammar of language
        + code generation: take AST and turn to executable code 
    + _scope_ 
        + maintains look-up list of declared identifiers, and enfore a set of rules on how they can be accessed
+ _lexical scope_ 
    + scope defined at lexing time
        + _lexing_ examines string of source code and assigns semantic meaning to tokens
    + defined by where function is declared regardless of where/how it is invoked
+ _function vs. block scope_
    + _function scope_ 
        + if `function` keyword is first thing in statement, it is a function declaration, otherwise its a function expression 
        ```js
        var a = 2;          // 2
        (function foo(){
            var a = 3;      // 3
        })();
        console.log(a)      // 2
        ```
        + Use of anonymous function as a function expression, `foo` is bound only within the function it is defined
    + _function expression_ 
        + function name can be omitted to create IIFE 
        + function expression is not hoisted 
        ```js 
        notHoisted()            // TypeError, not a function
        var notHoisted = function(){
            console.log('foo)
        }
        ```
    + _function statement_ 
        + function declaration is hoisted 
        ```js 
        hoisted()               // foo
        function hoisted(){
            console.log('foo)
        }
        ```
    + _anonymous vs. named_
        + always a better idea to use named function
            + function name is local to function body in which it is declared
        ```js 
        setTimeout(function timeoutHandler(){
            console.log('here');
        }, 1000);
        ```
    + _js does not have block scope_ 
        ```js 
        for(var i = 0; i < 10; i++){}
        ```
        here `i` is available to enclosing scope
    + `let`
        + attach variable declaration to scope of its block. 
        + will not hoist to front of scope, hence must first declare before use
        ```js 
        for(let i = 0; i < 10; i++){}
        // i out declared outside for loop 
        ```
    + _garbage collection_ 
        + function having closure may prevent proper garbage collection
    + `const` 
        + also creates block-scoped variables, but whose value is fixed 
        + prohibits change to that value at a lter time
        ```js 
        if(true){
            var a = 2
            const b = 3
            a = 3       // fine 
            b = 4       // error
        }
        console.log(a)  // 3
        console.log(b)  // ReferenceError
        ```
+ _hoisting_ 
    ```js 
    a = 2
    var a
    console.log(a)  // 2
    ```
    ```js 
    console.log(a)  // undefined 
    var a = 2
    ```
    + all declaration are processed first, before anything else, this is called hoisting
    ```js 
    foo();
    function foo(){
        console.log(a)  // undefined
        var a = 2
    }
    ```
    ```js 
    function foo(){
        var a
        console.log(a)  // undefined
        a = 2
    }
    foo()
    ```
    + hoisting is per scope
    ```js 
    foo()   // TypeError 
    bar()   // ReferenceError 
    var foo = function bar(){}
    ```
    ```js 
    var foo;
    foo()   // TypeError 
    bar()   // ReferenceError     
    foo = function(){
        var bar = ...self...
    }
    ```
    + observation
        + function declarations `foo` is hoisted 
            + `foo` is declared and hence does not result in `ReferenceError` 
            + but `foo` has no value yet, invoking `foo`, with value `undefined` results in `TypeError`
        + named function expression 
            + `bar`, the name identifier, is not available in enclosing scope
    ```js 
    foo()       // print 1
    var foo
    function foo(){
        console.log(1)
    }
    foo = function(){
        console.log(2)
    }
    ```
    ```js 
    function foo(){
        console.log(1)
    }
    foo()      // print 1
    foo = function(){
        console.log(2)
    }
    ```
    + functions are hoisted first, and then variables
        + `var foo` is a duplicate declaration and hence is ignored since it is hoisted after function

+ _scope closure_ 
    + _closure_ is when a function is able to remember and access its lexical scope even when that function is executing outside its lexical scope.
    ```js 
    function foo(){
        var a = 2;
        function bar(){
            console.log(a)
        }
        return bar
    }
    
    var baz = foo()
    baz()       // 2
    ```
    + observation 
        + `bar` has lexical scope access to inner scope of `foo`
        + `baz`, which is just `bar`, is execued outside of its declared lexical scope
        + in effect, inner scope of `foo` is still in use by `bar`, the reference of `bar` to inner scope of `foo` is called closure
    ```js 
    function wait(message){
        setTimeout(function timer(){
            console.log(message)
        }, 1000)
    }
    wiat("hello, closure")
    ```
    + observation 
        + `timer` function has closure over `wait` hence able to use the variable `message`
    ```js 
    for(var i = 1; i <= 5; i++){
        setTimeout(function timer(){
            console.log(i)
        }, i*1000)
    }
    // prints out `6` 5 times
    ```
    + observation 
        + `6` reflects value of `i` at end of for loop
        + the `timer` callback are all running well after the loop completes. 
        + the 5 `timer` callback, defined in each loop iteration, all are closed over the _same shared global scope_, where there is a single instance of `i`
            + i.e. all `timer` functions are referencing the same `i` in their closures
    ```js 
    for(var i = 1; i <= 5; i++){
        (function(j){
            setTimeout(function timer(){
                console.log(j)
            }, j * 1000)
        })(i)
    }
    ```
    + observation 
        + use of IIFE inside each iteration creates a new scope for each iteration 
        + so each `timer` callback enclosed oer new scope for each iteration, with `i` the corresponding index 
    ```js 
    for(let i = 1; i <= 5; i++){
        setTimeout(function timer(){
            console.log(i)
        }, i * 1000)
    }
    ```
    + observation 
        + use of `let` to declare variable `i` a new variable is declared at each iteration
    ```js 
    function CoolModule(){
        var something = 'cool'
        var another = [1, 2, 3]
        function doSomething(){
            console.log(something)
        }
        function doAnother1(){
            console.log(another.join(" ! "))
        }
        function doAnother2(){
            console.log(another.join(" , "))
        }
        return {
            doSomething: doSomething,
            doAnother: doAnother2
        }
    }
    var foo = CoolModule()
    foo.doSomething()   // Cool 
    foo.doAnother()     // 1 ! 2 ! 3
    ```
    + observation 
        + `CoolModule()` creates closure for function `doAnother` and `doSomething`
        + object returned has reference to inner function
    + _module pattern_ 
        + requirement 
            + IIFE enclosing function 
            + enclosing function rmust return at least one inner function, such that the inner function has closure over the private scope for access/modification 
        + the returning object act as a public API 
    + _ES6 modules_ 
        + each file is a separate module
        + each module both import other modules or specific API members
        + each module export their own public API members
    ```js 
    // bar.js
    function hello(who){
        return "let me introduce: " + who
    }
    export hello 

    // foo.js
    // import onlly hello from bar
    import hello from "bar" 
    var hungary = "hippo" 
    function awesome(){
        console.log(hello(hungry).toUpperCase())
    }
    export awesome

    // main.js
    // import the entire module
    module foo from "foo"
    module bar from "bar" 
    console.log(bar.hello("rhino))  
    foo.awesome()
    ```
    + `import` 
        + import one or more member into current scope, each to a bound variable 
    + `module`
        + imports entire module's API to current scope
    ```js 
    var foo = a => {
        console.log(a)
    }
    foo(2)  // 2
    ```
    + _lexical-this_ 
        + `=>` is short-hand for writing `function` keyword 
    ```js 
    var obj = {
        id: "awesome", 
        cool: function coolFn(){
            console.log(this.id)
        }
    }
    var id = "not awesome" 
    obj.cool()                  // awesome 
    setTimeout(obj.cool, 100)   // not awesome
    ``` 
    + observation 
        + loss of `this` binding on `cool` when using `setTimeout`
            + `this` binds to global instead  
        + one solution is using `var self =  this`
            + here `self` holds context of `this` during declaration 
            + `this` may change depending on where function is called, `self` will persists
        ```js 
        var obj = {
            count: 0,
            cool: function coolFn(){
                var self = this
                if(self.count < 1){
                    setTimeout(function timer(){
                        self.count++ 
                        console.log("awesome?")
                    }, 100)
                }
            }
        }
        obj.cool()  // awesome?
        ```
        + an easier solution with `=>` 
        ```js 
        var obj = {
            count: 0,
            cool: function coolFn(){
                if(self.count < 1){
                    setTimeout( () => {
                        this.count++ 
                        console.log("awesome?")
                    }, 100)
                }
            }
        }
        obj.cool()  // awesome?
        ```
        + `=>`
            + discard rules for `this` binding 
            + takes `this` of their immediate lexical enclosing scope, whatever it is.
            + in case of example, `this` inside `setTimeout` inherits `this` binding of `cool` function, which happens to be correct
        + or embrance `this` 
        ```js 
        var obj = {
            count: 0,
            cool: function coolFn(){
                if(this.count < 1){
                    setTimeout( function timer(){
                        this.count++    // safe because of bind 
                        console.log("awesome?")
                    }.bind(this), 100)
                }
            }
        }
        obj.cool()  // awesome?
        ```

    
## `this` and Object Prototypes 
+ `this`
    + keyword automatically defined in the scope of every function 
    ```js
    function identify() {
        return this.name.toUpperCase();
    }

    function speak() {
        var greeting = "Hello, I'm " + identify.call( this );
        console.log( greeting );
    }

    var me = {
        name: "Kyle"
    };

    var you = {
        name: "Reader"
    };

    identify.call( me ); // KYLE
    identify.call( you ); // READER

    speak.call( me ); // Hello, I'm KYLE
    speak.call( you ); // Hello, I'm READER
    ```
    + observation 
        + code reuse against multiple context (`me` or `you`) objects 
    + `this` is not the function itself 
    ```js 
    function foo(num) {
    console.log( "foo: " + num );

        // keep track of how many times `foo` is called
        this.count++;
    }

    foo.count = 0;

    var i;

    for (i=0; i<10; i++) {
        if (i > 5) {
            foo( i );
        }
    }
    // foo: 6
    // foo: 7
    // foo: 8
    // foo: 9

    // how many times was `foo` called?
    console.log( foo.count ); // 0 -- WTF?
    ```` 
    + observation 
        + `this.count` actually lives in the global space, not as a property of the function 
    + solutions 
        + incrementing property of function instead `foo.count++`
        + force `this` to actually point to `foo` function object 
        ```js 
        for (i=0; i<10; i++) {
            if (i > 5) {
                // using `call(..)`, we ensure the `this`
                // points at the function object (`foo`) itself
                foo.call( foo, i );
            }
        }
        ```
    + `this` is not function's lexical scope
    ```js 
    function foo(){
        var a = 2
        this.bar()
    }
    function bar(){
        console.log(this.a)
    }
    foo()       // undefined
    ```
    + observation 
        + `this.bar()` is incorrect way to `bar`
+ _call-site_ 
    + location in code where a function is called (not where its declared)
        + specifically, location on _call stack_ the function is in before its execution 
    





---


## ES6 and beyond 

__Syntax__ 
+ _blocked scope declaration with `let`_
    + use of IIFE to create scope
    ```js 
    var a = 2;
    (function IIFE(){
        var a = 3;
        console.log( a );	// 3
    })();
    console.log( a );		// 2
    ```
    + use of `let` for block scoping 
        + any `{}` suffices
    ```js 
    var a = 2;
    {
        let a = 3;
        console.log(a);      // 3
    }
    console.log(a);          // 2
    ```
    + `let` does not hoist  
        + accessing `let`-declared variable before its declaration causes error
    ```js 
    {
        console.log(a);     // undefined
        console.log(b);     // ReferenceError

        var a;
        let b;
    }
    ```
    + use `let` in `for` initialization 
        + redeclares `i` for each iteration, 
        + closures created inside loop iteration close over those per-iteration variables the way expected
    ```js 
    var funcs = []
    for(let i = 0; i < 5; i++){
        funcs.push(function(){
            console.log(i)
        })
    }
    funcs[3]()      // 3
    ```
+ _const_
    +  blocke-scope declaration; cannot change variable after initialization
        + a restriction on assignment rather than the value itself 
        + i.e. the value could still mutate, just assignment using the variable is not allowed
         ```js 
        {
            const a = [1, 2, 3];
            a.push(4);
            console.log(a);     // [1, 2, 3, 4]
            a = 42;              // TypeError
        }
        ```
        + `a` holds constant reference to array, instead of a constant array; the array is mutable
+ _block-scoped function_
    + function declaration inside of blocks are scoped to that block
        + function declaration is still hoisted
    ```js 
    {
        foo();              // works
        function foo(){

        }
    }
    foo();                  // ReferenceError
    ```
+ _spread/rest_ `...`
    
    + `...` in front of array (any iterable) spreads values into individual values 
        + used in spreading out an array as a set of arguments in a function call 
            ```js 
            function foo(x, y, z){
                console.lg(x, y, z)
            }
            foo( ...[1, 2, 3])
            ```
            + a syntactic sugar for `foo.apply(null, [1,2,3])`
        + used in array declaration 
            ```js 
            var a = [2, 3, 4]
            var b = [1, ...a, 5]    // 1,2,3,4,5
            ```
            + syntactic sugar for `[1].concat(a, [5])`
    + gathers a set of values (rest of) into an array 
        + used in representing params 
        ```js 
        function foo(x, y, ...z){
            console.log(x, y, z)
        }
        foo(1, 2, 3, 4, 5)  // 1 2 [3,4,5]
        ```
    + replaces the deprecated `arguments` 
        ```js 
        // doing things the new ES6 way
        function foo(...args) {
            // `args` is already a real array

            // discard first element in `args`
            args.shift();

            // pass along all of `args` as arguments
            // to `console.log(..)`
            console.log( ...args );
        }
        ```
+ _default parameter values_ 
    ```js 
    function foo(x, y){
        x = x || 11;
        y = y || 31;
        console.log(x + y)
    }
    foo()           // 42 
    foo(5, 6)       // 11
    foo(5)          // 36
    foo(null, 6)    // 17
    foo(0, 42)      // 53 <- not 42!
                    // because 0 is falsy, x <- 11 
    // hence have to write verbose 
     function foo(x, y){
        x = (x !== undefined) ? x : 11;
        y = (y !== undefined) ? x : 31;
        console.log(x + y)
    }
    ```
    + observation 
        + `undefined` means missing
    ```js 
    function foo(x = 11; y = 31){
        console.log(x + y)
    }
    foo()               // 42
    foo(5, 6)           // 11
    foo(0, 42)          // 42 

    foo(5)              // 36
    foo(5, undefined)   // 36, undefined=missing 
    foo(5, null)        // 5, null coerced to 0
    foo(undefined, 6)   // 17
    foo(null, 6)        // 6, 
    ```
+ _default value expression_ 
    + could be any valid expression 
    ```js 
    function bar(val){
        console.log("bar called")
        return y + val
    }
    function foo(x = y + 3, z = bar(x)){
        console.log(x, z)
    }
    var y = 5

    foo()       // bar called; 8, 13
    foo(10)     // bar called; 10, 15

    y = 6;
    foo(undefined, 10)  // 9, 10
    ```
    + observation 
        + default expresion is lazily evaluated; i.e. run iff needed, when arg is omitted or is `undefined` 
    ```js 
    var w = 1, z = 2;
    function foo(x = w + 1; y = x + 1; z = z + 1){
        consol.log(x, y, z)
    }
    foo()       // ReferenceError 
    ``` 
    + observation 
        + formal parameters in function declaratio are in their own scope 
            + as not in function body's scope 
        + `x = w + 1`, here `w` refer to 1 outside of scope
        + `y = x + 1`, here `x` refer to argument `x`, which is already initialized 
        + `z = z + 1`, here `z` is declared but uninitialized, does not look outside or parameter scope, so throws a `ReferenceError`
+ _destructuring_ 
    + _structured assignment_ by assigning values from an array or properties from an object without need for intermediate temp variable
    ```js 
    function foo() {
        return [1,2,3];
    }
    function bar() {
        return {
            x: 4,
            y: 5,
            z: 6
        };
    }
    

    var [a, b, c] = foo()

    // var tmp = bar(),
    //       x = tmp.x, y = tmp.y, z = tmp.z
    var {x:x, y:y z:z} = bar()
    ```
    + _object property assignment pattern_ 
        + if property name is same as variable want to assign 
            + can omit `x:` part 
        ```js 
        var {x, y, z} = bar()
        console.log(x, y, z)    // 4, 5, 6
        ```
        + may need longer form if need to assign to a different variable name 
            + `source: target`
            + `x: bam` means `x` is the source value and `bam` is target variable to assign to
        ```js
        var {x: bam, y:baz, z:bap} = bar()
        console.log(bam, baz, bap)  // 4, 5, 6
        console.log(x, y, z)        // ReferenceError
        ```
        + _vs. object literal_ 
            + _object literal_ 
                + `target <- source`
            + _destructuring_ 
                + `source -> target`
        ```js 
        var aa = 10, bb = 20;

        var o = { x: aa, y: bb };
        var     { x: AA, y: BB } = o;

        console.log( AA, BB );			// 10 20
        ```
    + _not just declaration_ 
        + destructuring is an _assignment_ operation, not just a _declaration_
            + when assigning object, have to enclose whole assignment expression in `()`, because otherwise `{}` will be taken as block argument instead of an object
        ```js 
        var a, b, c, x, y, z
        [a, b, c]=  foo()
        ({x, y, z} = bar())

        console.log(a, b, c)    // 1 2 3
        console.log(x, y, z)    // 4 5 6
        ```
        + examples 
            + object mappings/transformations
            ```js
            var o1 = { a: 1, b: 2, c: 3 },
            o2 = {};

            ( { a: o2.x, b: o2.y, c: o2.z } = o1 );

            console.log( o2.x, o2.y, o2.z );	// 1 2 3
            ```
            + mapping object to array 
            ```js 
            var o1 = { a: 1, b: 2, c: 3 },
            a2 = [];

            ( { a: a2[0], b: a2[1], c: a2[2] } = o1 );

            console.log( a2 );	
            ```
            + mapping array to object 
            ```js 
            var a1 = [ 1, 2, 3 ],
            o2 = {};

            [ o2.a, o2.b, o2.c ] = a1;

            console.log( o2.a, o2.b, o2.c );	// 1 2 3
            ```
            + swap two variables 
            ```js 
            var x = 10, y = 20
            [y, x] = [x, y]
            console.log(x, y)   // 20, 10
            ```
        + _repeated assignment_ 
            ```js 
            var {a: X, a: Y} = {a: 1}
            X   // 1
            Y   // 1
            ```
        + _organizing complex assignents_ 
            ```js 
            // harder to read:
            var { a: { b: [ c, d ], e: { f } }, g } = obj;

            // better:
            var {
                a: {
                    b: [ c, d ],
                    e: { f }
                },
                g
            } = obj;
            ```
        + _destructuring assignment expression_ 
            + `p` is assigned to object `o` 
            + same with array destructuring
            ```js 
            var o = { a:1, b:2, c:3 },
            a, b, c, p;

            p = { a, b, c } = o;

            console.log( a, b, c );     // 1 2 3  
            p === o;	            // true
            ```
            + chain of assignment 
            ```js 
            var o = { a:1, b:2, c:3 },
            p = [4,5,6],
            a, b, c, x, y, z;

            ( {a} = {b,c} = o );
            [x,y] = [z] = p;

            console.log( a, b, c );			// 1 2 3
            console.log( x, y, z );			// 4 5 4
            ```
        + _use with spread_ 
            ```js 
            var a = [2,3,4];
            var [ b, ...c ] = a;

            console.log( b, c );		    // 2 [3,4]
            ```
        + _default value assignment_ 
            ```js 
            var [a = 3, b = 6, c = 9, d = 12] = foo()
            var { x = 5, y = 10, z = 15, w = 20 } = bar();

            console.log( a, b, c, d );	    // 1 2 3 12
            console.log( x, y, z, w );	    // 4 5 6 20
            ```
        + _default value and alternative assignment_ 
            ```js 
            var { x, y, z, w: WW = 20 } = bar();

            console.log( x, y, z, WW );	    // 4 5 6 20
            ```
        + _nested destructuring_ 
            ```js 
            var a1 = [ 1, [2, 3, 4], 5 ];
            var o1 = { x: { y: { z: 6 } } };

            var [ a, [ b, c, d ], e ] = a1;
            var { x: { y: { z: w } } } = o1;

            console.log( a, b, c, d, e );   // 1 2 3 4 5
            console.log( w );               // 6
            ```
        + _nested destructuring and flatten out namespace_ 
            ```js 
            var App = {
                model: {
                    User: function(){ .. }
                }
            };

            // instead of:
            // var User = App.model.User;

            var { model: { User } } = App;
            ```
        + _destructuring parameters_ 
            ```js 
            function foo( [ x, y ] ) {
                console.log( x, y );
            }

            foo( [ 1, 2 ] );    // 1 2
            foo( [ 1 ] );       // 1 undefined
            foo( [] );          // undefined undefined
            ```
            ```js 
            function foo( { x, y } ) {
                console.log( x, y );
            }

            foo( { y: 1, x: 2 } );  // 2 1
            foo( { y: 42 } );       // undefined 42
            foo( {} );              // undefined undefined
            ```
            + so called _named arguments_ 
                + optional parameter can be in any position
        + _parameter destructure, nested destructure, default values_ 
            ```js 
            function f3([ x, y, ...z], ...w) {
                console.log( x, y, z, w );
            }

            f3( [] );               // undefined undefined [] []
            f3( [1,2,3,4], 5, 6 );  // 1 2 [3,4] [5,6]
            ```
        + _destructuring defaults + parameter defaults_ 
            ```js 
            function f6({ x = 10 } = {}, { y } = { y: 10 }) {
                console.log( x, y );
            }

            f6();                           // 10 10
            f6( undefined, undefined );     // 10 10
            f6( {}, undefined );            // 10 10

            f6( {}, {} );	                // 10 undefined
            f6( undefined, {} );            // 10 undefined

            f6( { x: 2 }, { y: 3 } );       // 2 3
            ```
            + note second arg `{}` is passed in so function parameter default value `{ y:10 }` is not used 
                + hence destructuring against empty `{}` yields `undefined` when searching for `y` name
            + so the form `{x = 10} = {}` is more desirable
        + _nested defaults: destructured and restructured_
            ```js 
            var defaults = {
                options: {
                    remove: true,
                    enable: false,
                    instance: {}
                },
                log: {
                    warn: true,
                    error: true
                }
            }; 

            var config = {
                options: {
                    remove: false,
                    instance: null
                }
            };

            // want to set all defaults to config, 
            // but not overwriting settings already written 

            // Approach 1: using Object.assign()
            // Suboptimal since its shallow 

            // Approach 2: merge `defaults` into `config`

            config.options = config.options || {};
            config.log = config.log || {};
            ({
                options: {
                    remove: config.options.remove = defaults.options.remove,
                    enable: config.options.enable = defaults.options.enable,
                    instance: config.options.instance = defaults.options.instance
                } = {},
                log: {
                    warn: config.log.warn = defaults.log.warn,
                    error: config.log.error = defaults.log.error
                } = {}
            } = config);

            // Approach 3: remove tmp variables 
            {
                // destructure (with default value assignments)
                let {
                    options: {
                        remove = defaults.options.remove,
                        enable = defaults.options.enable,
                        instance = defaults.options.instance
                    } = {},
                    log: {
                        warn = defaults.log.warn,
                        error = defaults.log.error
                    } = {}
                } = config;

                // restructure
                config = {
                    options: { remove, enable, instance },
                    log: { warn, error }
                };
            }
            ```
+ _object literal extension_ 
    + property with same name as a lexical identifier can shorten `x: x` to `x`
    ```js 
    var x = 2, y = 3,
        o = {
            x,
            y
        };
    ```
+ _concise method_ 
    + function shorthand 
    + shouldnt be used on recursive functions or event binding/unbinding, which requires a name to call itself
        + use `something: function something()` instead
    ```js 
    // Old
    var o = {
        x: function(){
            // ..
        },
        y: function(){
            // ..
        }
    }
    // ES6
    var o = {
        x() {
            // ..
        },
        y() {
            // ..
        }
    }
    ```
+ _getter/setter_ 
    ```js 
    var o = {
        __id: 10,
        get id() { return this.__id++; },
        set id(v) { this.__id = v; }
    }

    o.id;			// 10
    o.id;			// 11
    o.id = 20;
    o.id;			// 20

    // and:
    o.__id;			// 21
    o.__id;			// 21 -- still!
    ```
+ _computed property names_ 
    + using `[..]`
    ```js 
    var prefix = "user_";

    var o = {
        baz: function(..){ .. },
        [ prefix + "foo" ]: function(..){ .. },
        [ prefix + "bar" ]: function(..){ .. }
        ..
    };
    ```
+ _setting prototype_ 
    ```js 
    var o1 = {
        // ..
    };

    var o2 = {
        __proto__: o1,
        // ..
    };

    // Or with Object.setPrototypeOf
    var o1 = {
        // ..
    };

    var o2 = {
        // ..
    };

    Object.setPrototypeOf( o2, o1 );
    ```
+ `super`
    + only allowed in _concise methods_ 
    + only allows `super.prop` and not `super()` 
    + equates to `Object.getPrototypeOf(o2)`
    ```js 
    var o1 = {
        foo() {
            console.log( "o1:foo" );
        }
    };

    var o2 = {
        foo() {
            super.foo();
            console.log( "o2:foo" );
        }
    };

    Object.setPrototypeOf( o2, o1 );

    o2.foo();		// o1:foo; o2:foo
    ```
+ _template literal_ 
    + interpolated string literals delimited by backticks
        + `${}` is parsed and evaluated inline immediately
        + literal yields string
    ```js 
    var name = "Kyle";

    // pre-ES6
    var greeting = "Hello " + name + "!";
    // ES6
    var greeting = `Hello ${name}!`;

    console.log( greeting );        // "Hello Kyle!"
    console.log( typeof greeting );	// "string"
    ```
    + _interpolated expressions_ 
        + any valid expresion is allowed to appear in `{}`
        + name resolution is determined by lexical scope
        ```js 
        function upper(s) {
            return s.toUpperCase();
        }

        var who = "reader";

        var text =
        `A very ${upper( "warm" )} welcome
        to all of you ${upper( `${who}s` )}!`;

        console.log( text );
        // A very WARM welcome
        // to all of you READERS!
        ```
    + _tagged template literal_ 
        + any expression yielding a function before a template literal 
        ```js 
        function foo(strings, ...values) {
            console.log( strings );
            console.log( values );
        }

        var desc = "awesome";

        foo`Everything is ${desc}!`;
        // [ "Everything is ", "!"]
        // [ "awesome" ]
        ```
        ```js 
        function dollabillsyall(strings, ...values) {
            return strings.reduce( function(s,v,idx){
                if (idx > 0) {
                    if (typeof values[idx-1] == "number") {
                        // look, also using interpolated
                        // string literals!
                        s += `$${values[idx-1].toFixed( 2 )}`;
                    }
                    else {
                        s += values[idx-1];
                    }
                }

                return s + v;
            }, "" );
        }

        var amt1 = 11.99,
            amt2 = amt1 * 1.08,
            name = "Kyle";

        var text = dollabillsyall
        `Thanks for your purchase, ${name}! Your
        product cost was ${amt1}, which with tax
        comes out to ${amt2}.`

        console.log( text );
        // Thanks for your purchase, Kyle! Your
        // product cost was $11.99, which with tax
        // comes out to $12.95.
        ```
+ _arrow functions_ 
    + consists of 
        + parameter list in `(..)`
        + followed by `=>`
        + followed by function body 
            + `{}` necessary if there is more than 1 expression, or consists of non-expression statement
            + omit `{}` if just one expression 
                + implied `return` in front of expression
    + is always a _anonymous function expression_ 
        + hence no name required for recursion or event binding/unbinding 
    ```js 
    function foo(x,y) {
        return x + y;
    }

    // versus

    var foo = (x,y) => x + y;
    ```
    ```js 
    var f1 = () => 12;
    var f2 = x => x * 2;
    var f3 = (x,y) => {
        var z = x * 2 + y;
        y++;
        x *= 3;
        return (x + y + z) / 2;
    };
    ```
    + convenient in that quite many functions are short single statement utilities requiring a callback 
        + however maybe burdensome to omit `=>` as it sacrifices readability without `function` and `return` keywords
    ```js 
    var a = [1,2,3,4,5];

    a = a.map( v => v * 2 );

    console.log( a );       // [2,4,6,8,10]
    ```
    + solution to unpredictability of `this`
        + `this` is set lexically, to value of enclosing execution context's `this` that is set during function call
        + the `self = this` hack, since `this` binding in the callback will not be same as it is in `makeRequest`
        + `this` binding is dynamic, `self` has a predictable lexical scope
    + inside arrow functions, `this` binding is not dynamic but is instead lexical 
    ```js 
    var controller = {
        makeRequest: function(..){
            var self = this;

            btn.addEventListener( "click", function(){
                // ..
                self.makeRequest(..);
            }, false );
        }
    };

    // ES6 
    var controller = {
        makeRequest: function(..){
            btn.addEventListener( "click", () => {
                // ..
                this.makeRequest(..);
            }, false );
        }
    };
    ```
    + `=>` in function where we dont need the `self = this` hack 
    ```js 
    var controller = {
        makeRequest: (..) => {
            // ..
            this.helper(..);
        },
        helper: (..) => {
            // ..
        }
    };

    controller.makeRequest(..);
    ```
    + `this.helper` does not point to `controller` but instead lexically inherits `this` from surrounding scope, the `global` object 
    + rules for using `=>`
        + short, single-statement inline function expression that 
            + does not make a `this` reference inside 
            + no self-reference (recursion, event binding)
            + dont expect function to be ever that way 
        + inner function expression relying on `self = this` or `.bind(this)` call on it in the enclosing function to ensure proper `this` binding, inner function expression can become `=>` arrow function 
        + everything else -- normal functino declaration, longer multistatement function expression, function needing a lexical name identifier for self-reference and any other function that doesnt fit previous characteristics avoid using `=>`
+ `for..of` _loop_
    + loops over set of values (iterable) produced by an _iterator_ 
    ```js 
    var a = ["a","b","c","d","e"];

    for (var idx in a) {
        console.log( idx );
    }
    // 0 1 2 3 4

    for (var val of a) {
        console.log( val );
    }
    // "a" "b" "c" "d" "e"
    ```
    + comparison 
    ```js 
    var a = ["a","b","c","d","e"],
        k = Object.keys( a );

    for (var val, i = 0; i < k.length; i++) {
        val = a[ k[i] ];
        console.log( val );
    }
    // "a" "b" "c" "d" "e"
    ```
+ `for..in` 
    + used to iterate over object properties 
    + loop over keys in object 
    ```js
    var obj = {a: 1, b: 2, c: 3};

    for (var prop in obj) {
    console.log(`obj.${prop} = ${obj[prop]}`);
    }

    // Output:
    // "obj.a = 1"
    // "obj.b = 2"
    // "obj.c = 3"
    ```
+ _Number Literal Extensions_ 
    ```js 
    // pre-ES6
    var dec = 42,
        oct = 052,
        hex = 0x2a;
    // ES6
    var dec = 42,
        oct = 0o52,			// or `0O52` :(
        hex = 0x2a,			// or `0X2a` :/
        bin = 0b101010;		// or `0B101010` :/
+ _Symbols_ 
    + `symbol` is primitive 
        + cant use with `new`
    + `Symbol([description])` returns type `symbol` with static property 
        + every `symbol` is unique
    ```js 
    var sym = Symbol( "some optional description" );
    typeof sym;		// "symbol"
    ```
    + symbols are not instance of `Symbol`
    ```js 
    sym instanceof Symbol;		// false

    var symObj = Object( sym );
    symObj instanceof Symbol;	// true

    symObj.valueOf() === sym;	// true
    ```
    + purpose
        + create string-like value that can't collid with any other value (i.e. cant be duplicated) 
    + example 
        + a constant representing an event name 
        ```js 
        const EVT_LOGIN = Symbol("event.login")
        evthub.listen( EVT_LOGIN, function(data){
            // ..
        } );
        ```
        + _singleton_ pattern
        ```js 
        const INSTANCE = Symbol( "instance" );

        function HappyFace() {
            if (HappyFace[INSTANCE]) return HappyFace[INSTANCE];

            function smile() { .. }

            return HappyFace[INSTANCE] = {
                smile: smile
            };
        }

        var me = HappyFace(),
            you = HappyFace();

        me === you;			// true
        ``` 
    + _symbol registry_ 
        + `Symbol.for(key)`
            + searches for existing symbols with given key and return it if found. 
            + Otherwise a new symbol gets created in global symbol registry with this key
            ```js 
            Symbol.for('foo'); // create a new global symbol
            Symbol.for('foo'); // retrieve the already created symbol

            // Same global symbol, but not locally
            Symbol.for('bar') === Symbol.for('bar'); // true
            Symbol('bar') === Symbol('bar'); // false

            // The key is also used as the description
            var sym = Symbol.for('mario');
            sym.toString(); // "Symbol(mario)"
            ```
        + `Symbol.keyFor(sym)`
            + retrieves a shared symbol key from global symbol registry for a given symbol
            ```js 
            var globalSym = Symbol.for('foo'); // create a new global symbol
            Symbol.keyFor(globalSym); // "foo"

            var localSym = Symbol();
            Symbol.keyFor(localSym); // undefined
            ```
        ```js 
        const EVT_LOGIN = Symbol.for( "event.login" );
        console.log( EVT_LOGIN ); // Symbol(event.login)

        function HappyFace() {
            const INSTANCE = Symbol.for( "instance" );

            if (HappyFace[INSTANCE]) return HappyFace[INSTANCE];

            // ..

            return HappyFace[INSTANCE] = { .. };
        }
        ```
    + convention: use of prefix/context/namespace info in description to create/fetch symbols 
    + _built-in symbols_ 
        + not in global symbol registry 
        + stored on `Symbol` object 
+ __ES6 organization__ 
    + _iterators_   
        + organizing ordered, sequential, pull-based consumption of data 
        + _interface_ 
            + (required) 
                + `next()` retrieves next `IteratorResult`
            + (optinoal)
                + `return()` stops iterator and returns `IteratorResult`
                    + perform cleanup
                + `throw()` signals error and returns `IteratorResult`
            + `IteratorResult`
                + `value`: current iteration value or final return value 
                + `done`: boolean, completion status 
        ```js 
        var arr = [1,2,3];

        var it = arr[Symbol.iterator]();

        it.next();      // { value: 1, done: false }
        it.next();      // { value: 2, done: false }
        it.next();      // { value: 3, done: false }
        it.next();      // { value: undefined, done: true } 
        ```      
        + observation 
            + `Symbol.iterator`: calls iterator for object to be iterated (`for..of`)
            + i.e. `Array.prototype[@@iterator]()`
                + syntax: `arr[Symbol.iterator]()`
                + return: the array iterator function, which is `values()` by default
                ```js 
                var arr = ['w', 'y', 'k', 'o', 'p'];
                var eArr = arr[Symbol.iterator]();
                for (let letter of eArr) {
                console.log(letter);
                }

                // same as
                var arr = ['w', 'y', 'k', 'o', 'p'];
                var iterator = arr.values();

                for (let letter of iterator) {
                console.log(letter);
                }
                ```
            + i.e. `Set.prototype[@@iterator]()`
                + syntax `mySet[Symbol.iterator]`
                + return a set `iterator `function, `values()` by default 
                ```js 
                var mySet = new Set();
                mySet.add('0');
                mySet.add(1);
                mySet.add({});

                for (var v of mySet) {
                    console.log(v);
                }
                ```
            + `Set.prototype.entries()`
                + returns iterator object containing an array of `[value, value]` for each element
        + _iterator loop_ 
            + consumes an iterable directly or an iterator made with `Symbol.iterator` method
            + equivalent with `for (var v, res; (res = it.next()) && !res.done; )`
            ```js 
            var it = {
                // make the `it` iterator an iterable
                [Symbol.iterator]() { return this; },

                next() { .. },
                ..
            };

            for (var v of it) {
                console.log( v );
            }
            ```
        + _example: fib iterator_ 
            +  state of `n1` and `n2` maintained by closure
            + `Fib[Symbol.iterator]()` returns an iterator object with `next()` and `return()`
        ```js 
        var Fib = {
            [Symbol.iterator]() {
                var n1 = 1, n2 = 1;

                return {
                    // make the iterator an iterable
                    [Symbol.iterator]() { return this; },

                    next() {
                        var current = n2;
                        n2 = n1;
                        n1 = n1 + current;
                        return { value: current, done: false };
                    },

                    return(v) {
                        console.log(
                            "Fibonacci sequence abandoned."
                        );
                        return { value: v, done: true };
                    }
                };
            }
        };

        for (var v of Fib) {
            console.log( v );

            if (v > 50) break;
        }
        // 1 1 2 3 5 8 13 21 34 55
        // Fibonacci sequence abandoned.
        ```
        + _example: task queue iterator_ 
        ```js 
        var tasks = {
            [Symbol.iterator]() {
                var steps = this.actions.slice();

                return {
                    // make the iterator an iterable
                    [Symbol.iterator]() { return this; },

                    next(...args) {
                        if (steps.length > 0) {
                            let res = steps.shift()( ...args );
                            return { value: res, done: false };
                        }
                        else {
                            return { done: true }
                        }
                    },

                    return(v) {
                        steps.length = 0;
                        return { value: v, done: true };
                    }
                };
            },
            actions: []
        };

        // Usage 
        tasks.actions.push(
            function step1(x){
                console.log( "step 1:", x );
                return x * 2;
            },
            function step2(x,y){
                console.log( "step 2:", x, y );
                return x + (y * 2);
            },
            function step3(x,y,z){
                console.log( "step 3:", x, y, z );
                return (x * y) + z;
            }
        );

        var it = tasks[Symbol.iterator]();

        it.next( 10 );			// step 1: 10
                                // { value:   20, done: false }

        it.next( 20, 50 );		// step 2: 20 50
                                // { value:  120, done: false }

        it.next( 20, 50, 120 );	// step 3: 20 50 120
                                // { value: 1120, done: false }

        it.next();				// { done: true }
        ```
        + _iterator consumption_ 
            + spread `...` also consumes iterator 
    + _generator_ 
        + description 
            + a function that pauses itself mid-execution, which can be resumed either right away or at a later time
            + pause/resume can be used for two-way message passing,
                + generator returns value 
                + controlling code pass value back in 
        + syntax 
            + `function *foo() {}`
        + execution
            + an iterator is returned during function call, the function is not executed at this point
            ```js 
            function *foo(x, y){
                yield x + y
            }
            var it = foo(5, 10)
            ```
        + `yield`
            + _function_   
                + signal the pause point 
                + expression that sends out a value when pausing generator
                ```js 
                function *foo() {       // yields random number
                    while (true) {
                        yield Math.random();
                    }
                }
                ```
                + also receives (i.e. is replaced by) the eventual resumption value
                ```js 
                function *foo() {
                    // 10 assigned to x on resume
                    var x = yield 10;   
                    console.log( x );
                }
                ```
            + _properties_ 
                + has same _expression precedence_ as `=`; hencing wrapping in `()` would make `yield` be in any position
                + _right-associative_: meaning multiple `yield` in succession in succession is same as grouped with `()` from right to left 
                    + `yield yield 3` same as `(yield (yield 3))`
        + _yield delegation_
            + `yield * [iterable]`
            + delegates its own host generator's control to that iterator until it's exhausted
    + _modules_ 
        + previously 
            + outer funciton with inner variables and functions 
            + returned public API that have closure over inner data and capabilities 
            + a singleton is simply an IIFE 
        + ES6 modules 
            + _file-based_ modules 
                + cant be bundled in a single file but HTTP/2 may mitigate performance concertn since it very efficinetly load many smaller files in parallel 
            + _singleton_ modules 
                + import of one module to different files has a single reference 
            + properties/methods are _actual bindings_ and not just assignment of values or reference 
                + exporting a local private variable, even if it is primitive string/number, exports a binding to the variable. 
                + state is maintained 
                + requires a factory to generate multiple module instances 
            + importing a module is same as _statically requesting_ it to load
                + meaning loading module is blocked either over network on browser or from filesystem on a server 
                + however loading will happen preemptively 
        + syntax 
            + both `export` and `import` is at top-level scope 
                + i.e. must be outside of all blocks/functions
        + `export`
            + either in front of declaration or as operator with a specialist list of binding to export 
                + variable without `export` stays private inside scope of module  
            + _named export_    
            ```js
            export function fo(){}
            export var awesome = 42 
            var bar = [1, 2, 3]
            export { bar }

            // equivalent expression 
            function foo() {}
            var awesome = 42;
            var bar = [1,2,3];
            export { foo, awesome, bar };
            ```
            + renaming/_aliasing_ module member
            ```js
            function foo(){}
            export { foo as bar }
            // bar exposed, foo remains hidden
            ```
            + _binding is exported_ instead of reference 
            ```js 
            var awesome = 42;
            export { awesome };

            // later
            awesome = 100;
            ```
            + _default export_ 
                + one `default` per module definition 
                ```js
                function foo(){}
                export default foo 

                //equivalent to 
                export default function foo(){}
                ```
                + `export` the binding at that moment, instead of to identifier `foo`, hence later re-assignment to `foo` inside the module will not alter orignal `export`
                ```js 
                function foo(){}
                export {foo as default}
                ```
                + default binding to identifier `foo` instead, rather than its value, so changes to `foo` later in module will be reflected in the export
                ```js 
                // discouraged 
                export default function foo() { .. }
                foo.bar = function() { .. };
                foo.baz = function() { .. };

                // preferred 
                export default function foo() { .. }
                export function bar() { .. }
                export function baz() { .. }
                // or equivalently 
                function foo() { .. }
                function bar() { .. }
                function baz() { .. }
                export { foo as default, bar, baz, .. };
                ```
                + implies that concise default `import` will only retrieve `foo`, use could additionally manually list `bar` and `baz` as named imports if they want them
            + _two way binding_ not allowed 
                + i.e. cannot change value of imported variable
        + `import`
            + import named members to top-levels cope 
                + `import { foo, bar, baz } from "foo";`
                + `{}` is not destructuring operation
                + `"foo"` is _module specifier_, a string literal 
            + _renaming_ 
                ```js 
                import { foo as theFooFunc } from "foo";
                theFooFunc();
                ```
            + _default import_ 
                + `{}` can be skipped if only interested in `default` export 
                ```js 
                import foo from "foo";
                // or:
                import { default as foo } from "foo";
                ```
                + _default export with other named export_
                ```js 
                export default function foo(){}
                export function bar(){}
                export function baz(){}
                // import 1 default export and 2 named exports
                import FOOFN, {bar, baz as BAZ} from "foo"
                FOOFN()
                bar()
                BAZ()
                ```
            + _namespace import_   
                + import everything from a module to a single name space 
                    + all or nothing
                + `* as ...`
                ```js 
                export function bar() { .. }
                export var x = 42;
                export function baz() { .. }
                
                // import everything
                import * as foo from "foo";
                foo.bar();
                foo.x;			// 42
                foo.baz();
                ```
            + _import is readonly_ 
                + part of the static design philosophy
                ```js 
                import foofn, * as hello from "world";

                foofn = 42;			// (runtime) TypeError!
                hello.default = 42;	// (runtime) TypeError!
                hello.bar = 42;		// (runtime) TypeError!
                hello.baz = 42;		// (runtime) TypeError!
                ```
                + however can be bypassed by exporting an object instead, which can be changed elsewhere
            + _declaration is hoisted_ 
                ```js 
                foo();
                import { foo } from "foo";
                ```
            + _simple import_ 
                + `import "foo";`
                + does not import any binding, but loads, compiles and evaluates `"foo"` module 
        + _module loader_ 
            + hosting env determines module loading mechanism 
    + _class_ 
        + `class` identifies a block where contents define the mmeber of a function's prototype
        ```js 
        // pre-ES6
        function Foo(a,b) {
            this.x = a;
            this.y = b;
        }

        Foo.prototype.gimmeXY = function() {
            return this.x * this.y;
        }

        // ES6
        class Foo {
            constructor(a, b){
                this.x = a
                this.y = b
            }
            gimmeXY(){
                return this.x * this.y
            }
        }

        // instances 
        var f = new Foo( 5, 15 );

        f.x;						// 5
        f.y;						// 15
        f.gimmeXY();				// 75
        ```
        + observation 
            + `class Foo` implies creating a function name `Foo`
            + `constructor(..)` defines signature of `Foo(..)`
            + class methods use _concise method_ syntax 
            + unlike object literal, there is no comma separating members in `class` body 
            + `Foo(..)` of `class Foo` must be made with `new` 
            + class `Foo` is not hoisted while function `Foo` is
            + Note class `Foo` creates a lexical `Foo` identifier in that scope, while function `Foo` does not
        + `Symbol.hasInstace` to replace `instanceof`
        + think of class as a macro to populate a prototype object
    + `extends` 
        + syntactic sugar for establishing `[[Prototype]]` delegation link between 2 function prototypes 
            + i.e. `Bar extend Foo` link `[[Prototype]]` of `Bar.prototype` to `Foo.prototype`
    + `super`
        + In 
            + constructor: refer to _parent constructor_ (i.e. `Foo`)
            + method: refer to _parent object_, hence able to get property/method access (i.e. `Foo.prototype`)
        ```js 
        class Bar extends Foo {
            constructor(a,b,c) {
                super( a, b );
                this.z = c;
            }

            gimmeXYZ() {
                return super.gimmeXY() * this.z;
            }
        }

        var b = new Bar( 5, 15, 25 );

        b.x;						// 5
        b.y;						// 15
        b.z;						// 25
        b.gimmeXYZ();				// 1875
        ``` 
    + doesnt work 
        + access non-constructor method in constructor with `super.prototype` 
        + access constructor in non-constructor method 
    + _subclass constructor_ 
        + default constructor is automatically created/called 
            + same as C++, not Java though
        ```js 
        constructor(...args){
            super(...args)
        }
        ```
    + `this` is available after `super` call in constructor
    + _extending natives_ 
        ```js 
        class MyCoolArray extends Array {
            first() {return this[0]}
            last() {return this[this.length - 1]}
        }
        ```
        ```js 
        class Oops extends Error{
            constructor(reason){
                super(reason)
                this.oops = reason
            }
        }
        var ouch = new Oops("I messed up")
        throw ouch
        ```
        + capture stack info 
    + _meta property_ `new.target`
        + a value available in all functions, 
            + `undefined` in normal function 
            + points at constructor that `new` actually directly invoked in constructor, even if the constructor is in parent class and was delgated to by a `super(..)` call from a child constructor 
        ```js 
        class Foo {
            constructor() {
                console.log( "Foo: ", new.target.name );
            }
        }

        class Bar extends Foo {
            constructor() {
                super();
                console.log( "Bar: ", new.target.name );
            }
            baz() {
                console.log( "baz: ", new.target );
            }
        }

        var a = new Foo();
        // Foo: Foo

        var b = new Bar();
        // Foo: Bar   <-- respects the `new` call-site
        // Bar: Bar

        b.baz();
        // baz: undefined
        ```
    + _static_ 
        + `static` are called without instantiating class and cannot be called through a class instnace
        + `static` member is on a parallel chain between functino constructor instead of on class's prototype chain 
        ```js 
        class Foo {
            static cool() { console.log( "cool" ); }
            wow() { console.log( "wow" ); }
        }

        class Bar extends Foo {
            static awesome() {
                super.cool();
                console.log( "awesome" );
            }
            neat() {
                super.wow();
                console.log( "neat" );
            }
        }

        Foo.cool();         // "cool"
        Bar.cool();         // "cool"
        Bar.awesome();      // "cool"
                            // "awesome"

        var b = new Bar();
        b.neat();           // "wow"
                            // "neat"

        b.awesome;          // undefined
        b.cool;	            // undefined
        ```
    + _Symbol.species Constructor getter_ 
+ __async flow contro__
+ __Collections__ 
    + _TypedArrays_ 
         + array like view of an underlying binary data buffer 
         ```js 
         // Setting and getting using standard array syntax
         var int16 = new Int16Array(2);
         int16[0] = 42;
         console.log(int16[0]); // 42

         // Indexed properties on prototypes are not consulted (Fx 25)
         Int8Array.prototype[20] = 'foo';
         (new Int8Array(32))[20]; // 0
         // even when out of bound
         Int8Array.prototype[20] = 'foo';
         (new Int8Array(8))[20]; // undefined
         // or with negative integers
         Int8Array.prototype[-1] = 'foo';
         (new Int8Array(8))[-1]; // undefined

         // Named properties are allowed, though (Fx 30)
         Int8Array.prototype.foo = 'bar';
         (new Int8Array(32)).foo; // "bar"
        ```
    + _set_ 
        + object where key can be anything (not only string)
        ```js 
        var m = {};

        var x = { id: 1 },
            y = { id: 2 };

        m[x] = "foo";
        m[y] = "bar";

        m[x];               // "bar"
        m[y];               // "bar"
        ```
        + observation 
            + `x` and `y` are stringified to `[object object]`,which is the only key set in `m`
        ```js 
        var m = new Map();

        var x = { id: 1 },
            y = { id: 2 };

        m.set( x, "foo" );
        m.set( y, "bar" );

        m.get( x );						// "foo"
        m.get( y );						// "bar"

        m.delete( y );
        m.size;							// 1

        m.clear();
        m.size;							// 0
        ```
        + observation 
            + cant use `[]` operator for get/set 
            + use `.delete(..)` instead of `delete`
            + `.size()` returns number of keys 
            + `.clear()` clears the set 
        ```js 
        var m2 = new Map(m.entries())
        //equivalent to 
        var m2 = new Map(m)

        // manual specify entries list 
        var x = { id: 1 },
            y = { id: 2 };

        var m = new Map( [
            [ x, "foo" ],
            [ y, "bar" ]
        ] );

        m.get( x );						// "foo"
        m.get( y );						// "bar"
        ```
        + observation 
            + map constructor accepts iterator as well
            + `entries` list can be specified manually
        ```js 
        var m = new Map();

        var x = { id: 1 },
            y = { id: 2 };

        m.set( x, "foo" );
        m.set( y, "bar" );

        var vals = [ ...m.values() ];

        vals;							// ["foo","bar"]
        Array.from( m.values() );		// ["foo","bar"]
        ```
        + observation 
            + `.values(..)` returns an iterator 
            + `[...m.values()]` spreads iterator 
        ```js 
        var m = new Map();

        var x = { id: 1 },
            y = { id: 2 };

        m.set( x, "foo" );
        m.set( y, "bar" );

        var keys = [ ...m.keys() ];

        keys[0] === x;					// true
        keys[1] === y;					// true

        m.has( x );						// true
        ```
        + observation 
            + `.keys()`: returns a list of keys 
            + `.has(key)`: evaluates if the set contains `key` 
    + _sets_ 
        + a collection of unique values 
        ```js 
        var s = new Set();

        var x = { id: 1 },
            y = { id: 2 };

        s.add( x );
        s.add( y );
        s.add( x );

        s.size;							// 2

        s.delete( y );
        s.size;							// 1

        s.clear();
        s.size;							// 0
        ```
        ```js 
        var x = { id: 1 },
            y = { id: 2 };

        var s = new Set( [x,y] );
        ```
        + observation 
            + `set` constructor expets `.values()` list
        + has no `.get()` method since only interested in membership test `.has(obj)`
        + _set iterator_ 
            + `.keys()` and `.values()` yields a list of unique values in the set 
                + `.values()` is the default iterator
            + `.entries()` yields a list of entry arrays, where both items of the array are the unique set values 
        ```js 
        var s = new Set();

        var x = { id: 1 },
            y = { id: 2 };

        s.add( x ).add( y );

        var keys = [ ...s.keys() ],
            vals = [ ...s.values() ],
            entries = [ ...s.entries() ];

        keys[0] === x;
        keys[1] === y;

        vals[0] === x;
        vals[1] === y;

        entries[0][0] === x;
        entries[0][1] === x;
        entries[1][0] === y;
        entries[1][1] === y;
        ```


