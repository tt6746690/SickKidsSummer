#ifdef __TO_RPKM__
#define __TO_RPKM__

#include <string>
#include <cstdio>

class LineReader
{
  public:
    explicit LineReader(std::string path, std::string mode);
    ~LineReader();

    LineReader(const LineReader &) = delete;
    LineReader &oeprator = (const LineRreader &) = delete;

  protected:
    void open(std::string path, std::string mode);
    void close();

    FILE *fd_;
    char *line_;
};

#endif