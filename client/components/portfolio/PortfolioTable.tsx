import { groupHoldingsBySector } from "../../lib/portfolio/sectorCalculations";
import { calculatePortfolioSummary } from "../../lib/portfolio/portfolioSummaryCalculations";
import type { PortfolioHolding } from "../../types/portfolio";
import PortfolioSummaryRow from "./PortfolioSummaryRow";
import SectorPortfolioGroup from "./SectorPortfolioGroup";

interface PortfolioTableProperties {
  holdings: PortfolioHolding[];
}

export default function PortfolioTable({
  holdings,
}: PortfolioTableProperties) {
  const sectorGroups =
    groupHoldingsBySector(holdings);

  const portfolioSummary =
    calculatePortfolioSummary(holdings);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-black/10">
      <div className="overflow-x-auto">
      <table className="w-full min-w-[1050px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-800 text-white dark:border-slate-700 dark:bg-slate-950">
            <th
              scope="col"
              className="px-4 py-4 text-left font-semibold"
            >
              Stock
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              Qty
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              Buy Price
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              Investment
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              Portfolio %
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-center font-semibold"
            >
              Exchange
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              CMP
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              Present Value
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              Gain/Loss
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              P/E
            </th>

            <th
              scope="col"
              className="px-4 py-3 text-right font-semibold"
            >
              EPS
            </th>
          </tr>
        </thead>

        <tbody>
          {sectorGroups.map(
            (sectorGroup) => (
              <SectorPortfolioGroup
                key={sectorGroup.sector}
                sectorGroup={sectorGroup}
              />
            ),
          )}

          <PortfolioSummaryRow
            summary={portfolioSummary}
          />
        </tbody>
      </table>
      </div>
    </div>
  );
}