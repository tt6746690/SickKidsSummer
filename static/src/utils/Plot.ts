import * as d3 from "d3";
/* 
    Formats gene expression data for scatter plotting
    Returns data: {
        <tissueSite>: [ ...[exonNum, [ ... readCounts ]]  ],
        ...
    }
*/
export const formatGeneScatterPlotData = geneEntities => {
  let data = {};

  geneEntities.forEach(geneEntity => {
    data[geneEntity.ensemblId] = [];

    Object.keys(geneEntity.geneExpr).map(tissue => {
      geneEntity.geneExpr[tissue].map(rpkm => {
        data[geneEntity.ensemblId].push([tissue, rpkm]);
      });
    });
  });

  return data;
};

/* 
    Compute necessary summary statistics for box plot 
*/
const computeBoxPlotStatistics = (l: number[]) => {
  let sorted = l.sort(d3.ascending);

  let min = sorted[0];
  let firstQuartile = d3.quantile(sorted, 0.25);
  let median = d3.quantile(sorted, 0.5);
  let thirdQuartile = d3.quantile(sorted, 0.75);
  let max = sorted[sorted.length - 1];
  let iqr = thirdQuartile - firstQuartile;
  let upperWhisker = d3.min([max, thirdQuartile + iqr]);
  let lowerWhisker = d3.max([min, firstQuartile - iqr]);

  let outliers = [];

  let index = 0;
  while (index++ < sorted.length) {
    if (sorted[index] >= firstQuartile - 1.5 * iqr) {
      lowerWhisker = sorted[index];
      break;
    } else {
      outliers.push(sorted[index]);
    }
  }
  index = sorted.length - 1;
  while (index-- >= 0) {
    if (sorted[index] <= thirdQuartile + 1.5 * iqr) {
      upperWhisker = sorted[index];
      break;
    } else {
      outliers.push(sorted[index]);
    }
  }
  return {
    firstQuartile,
    median,
    thirdQuartile,
    iqr,
    upperWhisker,
    lowerWhisker,
    outliers,
    sorted
  };
};

/* 
  Computs summary statistics for box plotting 
  Return data: [
    ...,
    {
      x,              // x value
      id,
      i,              // index to number of selected gene/tissue
      firstQuartile,  // first quartile y-value 
      median,         // median y-value
      thirdQuartile,  // third quartile y-value
      iqr,            // inter-quartile range
      upperWhisker,   
      lowerWhisker,
      outliers,       // data points lying outside of upper/lower whiskers
    }
  ]
  */
export const formatGeneBoxPlotData = geneEntities => {
  let data = [];

  geneEntities.forEach((geneEntity, i) => {
    Object.keys(geneEntity.geneExpr).map(tissue => {
      let summaryStatistics = computeBoxPlotStatistics(
        geneEntity.geneExpr[tissue]
      );

      data.push({
        i,
        x: tissue,
        id: geneEntity.ensemblId,
        ...summaryStatistics
      });
    });
  });

  return data;
};

/* 
    Formats exon expression data for scatter plotting 
    Returns data: {
            <tissueSite>: [ ...[exonNum, [ ... readCounts ]]  ],
            ...
        } 
*/
export const formatExonScatterPlotData = (
  exonExpr: Object,
  tissues: string[]
) => {
  let flattened = {};
  let tissue;

  tissues.forEach((tissue: string) => {
    flattened[tissue] = [];
    Object.keys(exonExpr).forEach((exonNum: string) => {
      let reads = exonExpr[exonNum][tissue];
      reads.map(read => {
        flattened[tissue].push([parseInt(exonNum), read]);
      });
    });
  });

  return flattened;
};

/* 
  Computs summary statistics for box plotting 
  */
export const formatExonBoxPlotData = (exonExpr: Object, tissues: string[]) => {
  let data = [];

  tissues.forEach((tissue: string, i) => {
    Object.keys(exonExpr).forEach((exonNum: string) => {
      let {
        reads,
        mean,
        overByTtest,
        overByMedian,
        overByMean,
        ttest_1samp,
        median
      } = exonExpr[exonNum][tissue];

      let [t_statistic, p_value] = ttest_1samp;
      let summaryStatistics = computeBoxPlotStatistics(reads);

      data.push({
        i,
        x: exonNum,
        id: tissue,
        mean,
        overByTtest,
        overByMedian,
        overByMean,
        t_statistic,
        p_value,
        ...summaryStatistics
      });
    });
  });

  return data;
};
