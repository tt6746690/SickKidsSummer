COMPILER = clang++
CPPFLAGS = -std=c++1z -stdlib=libc++ -Wall -I.

CPP_FILES = $(wildcard ./*.cpp)
EXECUTABLES = $(CPP_FILES:.cpp=)

HEADERS = to_rpkm.h
OBJS = to_rpkm.o

all: to_rpkm

counts: $(OBJS) 
	$(COMPILER) $(CPPFLAGS) -o $@ $^

%.o: %.cpp $(HEADERS)
	$(COMPILER) $(CPPFLAGS) -c -o $@ $<

clean:
	rm ./*.o
	rm to_rpkm