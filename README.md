# BrainfuckInterpreter
Typescript interpreter for the Brainfuck language.

Live version at https://rinsho.github.io/BrainfuckInterpreter/index.html

## Example Code
The following is a double ray-casting algorithm and half-planes to determine
whether a point is in a polygon. The acceptable point ranges are x: 0-9 and y: 0-9.

### Memory Layout
Memory: Pointer movement optimization prioritized.
```
 -------------------------------------------------------------------
 C1 | C2 | X | S2 | Y1 | Y | X2 | X1 | T0 | T1 | T2 | T3 | Y2 | S1 |
 -------------------------------------------------------------------
```

### Interpreter Settings
Memory size (blocks): 14

### Code
```
>>,>>>,>>,,<<<,>>,,>>>>>>,                                        Read test point and 
                                                                  first two polygon points
[                                                                 Until end of input
    [<<<<+>+>>>-]<<<[>>>+<<<-]                                    t0 = y2
    <<<<[>>>>+>+<<<<<-]>>>>>[<<<<<+>>>>>-]                        t1 = y
    <<[>>+<[>[-]>+<<-]>>[<<+>>-]<[<<[-]+<<<<<+>>>>>>>-]<-<-]>[-]  s2 = y2 greater than y
    <<<<<[>>>>+>+<<<<<-]>>>>>[<<<<<+>>>>>-]                       t0 = y1                                               
    <<<<[>>>>+>+<<<<<-]>>>>>[<<<<<+>>>>>-]                        t1 = y
    <<[>>+<[>[-]>+<<-]>>[<<+>>-]<[<<[-]+>>>>>+<<<-]<-<-]>[-]      s1 = y1 greater than y
    >>>>[<<<<+>>>>-]                                              t1 = s1
    <<<<<<<<<<[>>>>>>-<+<<<<<-]>>>>>[<<<<<+>>>>>-]>[>>>>+<<<<[-]] s1 = s1 != s2
    >>>>[-                                                        if (s1)
        <<<<<<[>+>+<<-]>>[<<+>>-]                                   t0 = x1
        <<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]                            t1 = x2 
        <<[>>+<[>[-]>+<<-]>>[<<+>>-]<[<<[-]+>>>>>+<<<-]<-<-]>[-]    s1 = x1 greater than x2 
        +>>>>[-<<<<-                                                if (s1)
            <<<[>>+<-<-]>>[<<+>>-]                                    x1 = x1 minus x2
        >>>>>]<<<<[-                                                else
            <<<[>>+>+<<<-]>>>[<<<+>>>-]<<[>-<-]>[<+>-]                x1 = x2 minus x1
        >]
        +<<<<<<[->>>>>>-                                            if (s2)
            >>>[<<<<+>+>>>-]<<<[>>>+<<<-]                             t0 = y2
            <<<<[>>>>+<-<<<-]>>>>[<<<<+>>>>-]                         t0 = y2 minus y
        <<<<<<]>>>>>>[-                                             else
            <<<<[>>>+>+<<<<-]>>>>[<<<<+>>>>-]                         t0 = y
            >>>[<<<+<->>>>-]<<<[>>>+<<<-]                             t0 = y minus y2
        ]
        <<[>>>+<<<-]                                                t2 = x1
        >>>[<<[>+<<+>-]>[<+>-]>-]<<[-]                              x1 = x1 * t0
        <<<<[>>>>+>+<<<<<-]>>>>>[<<<<<+>>>>>-]                      t0 = y1
        >>>[<<<+>+>>-]<<[>>+<<-]                                    t1 = y2
        <<[>>+<[>[-]>+<<-]>>[<<+>>-]<[<<[-]+>>>>>+<<<-]<-<-]>[-]    s1 = y1 greater than y2
        +>>>>[-<<<<-                                                if (s1)
            >>>[<<+<<<<<<->>>>>>>>-]<<[>>+<<-]                        y1 = y1 minus y2
        >>>]<<<<[-                                                  else
            >>>[<<<+<+>>>>-]                                         t0 = y2
            <<<<<<<<[>>>>-<<<<-]>>>>[<<<<+>>>>-]>[>>>+<<<-]          y1 = y2 minus y1
        ]
        <<[>+<-]                                                    t0 = x1
        >[<<<<[>>>>>+>+<<<<<<-]>>>>>>[<<<<<<+>>>>>>-]
        <[>+<<-[>>[-]>+<<<-]>>>[<<<+>>>-]<[<-[<<->>[-]]+>-]<-]<<+>] x1 = x1 / y1
        <<[>+>+<<-]>>[<<+>>-]                                       x1 = x1 plus x2
        <<<<<<[>>>>>>+>+<<<<<<<-]>>>>>>>[<<<<<<<+>>>>>>>-]          t0 = x
        <<[>>>+>+<<<<-]>>>[<<<+>>>-]                                t3 = x1  
        <<[>+<-]>>>[<<->+>-]<[>+<-]<[<+>[-]]                        t0 = x != x1
        +<[->-                                                      if (t0)
            <<<<<<<[>>>>>>+>+<<<<<<<-]>>>>>>>[<<<<<<<+>>>>>>>-]       t0 = x
            <[>>+>[<[-]<+>>-]<<[>>+<<-]>[<<[-]+<<<<<<<<[>>>+       
            <<<-]+>>>[<<<->>>-]>>>>>>>-]>-<<<-]>>>[-]<<<              c1 = x greater than x1 then !c2
            <<<<<<[>>>>>>+>+<<<<<<<-]>>>>>>>[<<<<<<<+>>>>>>>-]        t0 = x
            <<[>>>+<<[>>[-]<+<-]>[<+>-]>[<<<[-]+<<<<<<[>>+<<-]+         
            >>[<<->>-]>>>>>>>-]<<-<-]>[-]                             c2 = x less than x1 then !c2
        ]>[-                                                        else
            <<<<<<<<[>>+<<-]+>>[<<->>-]                               C2 = !C2
        >>>>>>]
    >>>>]
    <<<<<<[-]<<<[-]<[-]
    >>>[>+<-],,>>>>>>[<<<<<<<<+>>>>>>>>-],                        Copy (x2 y2) to (x1 y1) 
                                                                  and read (x2 y2)
]
<<<<<<<<<<<<[>+<-]>[>>+<<[-]]>>[<<+>>-]                           c2 = c2 || c1
++++++++[<<++++++>>-]<<.                                          Print c
```

### Input
Input is formatted as ab,xy,xy,xy,... for the test point (a,b) and the points (x,y) 
that make up the polygon bounds.
> 33,20,41,44,25,12,20

### Expected Output
Output is 1 if the point is within the polygon or 0 if it is not. Priority is given
to catching out-of-bounds values rather than on-the-bounds values though inner-vertices 
are properly handled.
> 1