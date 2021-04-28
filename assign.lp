some_bid(M, P) :-  bid(M, P, X).
bid(M, P, N) :-  not some_bid(M, P), pc(M), paper(P), number(N).
pc(m1).
pc(m2).
paper(p1).
bid(m1, p1, 2).
number(1).
number(2).
number(3).