COMPILER = clang++
CPPFLAGS = -std=c++1z -stdlib=libc++ -Wall -I.

CPP_FILES = $(wildcard ./*.cpp)
EXECUTABLES = $(CPP_FILES:.cpp=)

HEADERS = counts.h
OBJS = counts.o

all: counts

counts: $(OBJS) 
	$(COMPILER) $(CPPFLAGS) -o $@ $^

%.o: %.cpp $(HEADERS)
	$(COMPILER) $(CPPFLAGS) -c -o $@ $<

clean:
	rm ./*.o
	rm counts