

#include <algorithm>
#include <cassert>
#include <counts.h>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <iterator>
#include <sstream>
#include <string>
#include <utility>
#include <vector>

template <typename Container>
std::ostream &operator<<(const std::ostream &, Container c) {

  int num_shown = 10;
  std::cout << "[ ";

  for (auto &elem : c) {
    if (--num_shown < 0)
      return std::cout << "... ]; size: " << c.size();
    std::cout << elem << ", ";
  }

  return std::cout << std::endl;
}

int main(int argc, char *argv[]) {

  std::vector<double> read_counts;
  read_counts.reserve(8555);
  std::vector<double> tokens;
  tokens.reserve(8555);

  std::ifstream f(
      "../../data/GTEx_Analysis_v6_RNA-seq_RNA-SeQCv1.1.8_exon_reads.txt");

  std::string column_names;
  std::getline(f, column_names); // header row

  int line_num = 0;
  for (std::string line; std::getline(f, line); line_num++) {

    std::istringstream iss(line);
    std::string token;
    std::getline(iss, token, '\t'); // row name

    while (std::getline(iss, token, '\t'))
      tokens.emplace_back(std::stod(token));

    if (read_counts.empty())
      read_counts = tokens;
    else {
      assert(tokens.size() == read_counts.size());
      std::transform(read_counts.begin(), read_counts.end(), tokens.begin(),
                     read_counts.begin(),
                     [](double counts, double tok) { return counts + tok; });
    }
    tokens.clear();

    if (line_num % 1000 == 0)
      std::cout << line_num << std::endl;
  }

  std::ofstream outf("./read_counts.txt");
  outf << std::string("[");
  for (const auto &c : read_counts) {
    outf << std::fixed << std::setprecision(9) << c << ", ";
  }
  outf << "]";

  return 0;
}