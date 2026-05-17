import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SectionLabel from './components/SectionLabel';
import SummaryBar from './components/SummaryBar';
import ConnectionCard from './components/cards/ConnectionCard';
import IpVersionCard from './components/cards/IpVersionCard';
import DnsCard from './components/cards/DnsCard';
import SpeedTestCard from './components/cards/SpeedTestCard';
import PingCard from './components/cards/PingCard';
import BlockCheckCard from './components/cards/BlockCheckCard';
import VerdictCard from './components/cards/VerdictCard';
import {
  PING_TARGETS,
  BLOCK_TARGETS,
  checkWifi,
  checkIpVersions,
  checkDns,
  checkSpeed,
  checkPing,
  checkBlockStatus,
  checkVerdict,
} from './diagnostics';

export default function App() {
  const [running, setRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState('init');
  const [wifiData, setWifiData] = useState(null);
  const [ipData, setIpData] = useState(null);
  const [dnsData, setDnsData] = useState(null);
  const [speedData, setSpeedData] = useState(null);
  const [pingData, setPingData] = useState(null);
  const [blockData, setBlockData] = useState(null);
  const [verdictData, setVerdictData] = useState(null);
  const [wifiLoading, setWifiLoading] = useState(false);
  const [ipLoading, setIpLoading] = useState(false);
  const [dnsLoading, setDnsLoading] = useState(false);
  const [speedLoading, setSpeedLoading] = useState(false);
  const [pingLoading, setPingLoading] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [verdictLoading, setVerdictLoading] = useState(false);
  const [pingTargets, setPingTargets] = useState(
    PING_TARGETS.map((t) => ({ ...t, cls: '', label: '…', loading: true }))
  );
  const [blockItems, setBlockItems] = useState(
    BLOCK_TARGETS.map((t) => ({ ...t, cls: '', resultLabel: 'Checking…' }))
  );
  const [summary, setSummary] = useState({ passed: 0, warnings: 0, failures: 0 });
  const [showSummary, setShowSummary] = useState(false);

  const runAllDiagnostics = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setOverallStatus('running');
    setShowSummary(false);
    let passed = 0, warnings = 0, failures = 0;
    setPingTargets(PING_TARGETS.map((t) => ({ ...t, cls: '', label: '…', loading: true })));
    setBlockItems(BLOCK_TARGETS.map((t) => ({ ...t, cls: '', resultLabel: 'Checking…' })));
    //Connection + IP (parallel)
    setWifiLoading(true);
    setIpLoading(true);
    const [wifiResult, ipResult] = await Promise.all([checkWifi(), checkIpVersions()]);
    setWifiData(wifiResult);
    setWifiLoading(false);
    setIpData(ipResult);
    setIpLoading(false);
    passed += (wifiResult.passed || 0) + (ipResult.passed || 0);
    failures += (wifiResult.failures || 0) + (ipResult.failures || 0);
    //DNS
    setDnsLoading(true);
    const dnsResult = await checkDns();
    setDnsData(dnsResult);
    setDnsLoading(false);
    passed += dnsResult.passed || 0;
    warnings += dnsResult.warnings || 0;
    //Speed
    setSpeedLoading(true);
    const speedResult = await checkSpeed();
    setSpeedData(speedResult);
    setSpeedLoading(false);
    passed += speedResult.passed || 0;
    warnings += speedResult.warnings || 0;
    failures += speedResult.failures || 0;
    setPingLoading(true);
    const pingResult = await checkPing((host, ms, cls, label, history) => {
      setPingTargets((prev) =>
        prev.map((t) =>
          t.host === host ? { ...t, cls, label, loading: false } : t
        )
      );
      setPingData((prev) => ({ ...(prev || {}), pingHistory: history }));
    });
    setPingData(pingResult);
    setPingLoading(false);
    passed += pingResult.passed || 0;
    warnings += pingResult.warnings || 0;
    failures += pingResult.failures || 0;
    setBlockLoading(true);
    const blockResult = await checkBlockStatus((host, ok, ms, cls, label) => {
      setBlockItems((prev) =>
        prev.map((t) =>
          t.host === host ? { ...t, cls, resultLabel: label } : t
        )
      );
    });
    setBlockData(blockResult);
    setBlockLoading(false);
    passed += blockResult.passed || 0;
    warnings += blockResult.warnings || 0;
    failures += blockResult.failures || 0;

    setVerdictLoading(true);
    const verdictResult = await checkVerdict(
      blockResult,
      pingResult.pingHistory,
      ipResult.rawIpv6
    );
    setVerdictData(verdictResult);
    setVerdictLoading(false);
    passed += verdictResult.passed || 0;
    warnings += verdictResult.warnings || 0;
    failures += verdictResult.failures || 0;
    setSummary({ passed, warnings, failures });
    setShowSummary(true);
    if (failures > 0) setOverallStatus('bad');
    else if (warnings > 0) setOverallStatus('warn');
    else setOverallStatus('ok');

    setRunning(false);
  }, [running]);

  // Auto-run on first load
  useEffect(() => {
    const timer = setTimeout(runAllDiagnostics, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="bg-grid"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="container">
        <Header status={overallStatus} />
        <Hero running={running} onRun={runAllDiagnostics} />
        <SectionLabel text="Connection Information" />
        <div className="cards-grid cols-3">
          <ConnectionCard data={wifiData} loading={wifiLoading} />
          <IpVersionCard data={ipData} loading={ipLoading} />
          <DnsCard data={dnsData} loading={dnsLoading} />
        </div>
        <SectionLabel text="Network Performance" />
        <div className="cards-grid cols-2-1">
          <SpeedTestCard data={speedData} loading={speedLoading} />
          <PingCard data={pingData} loading={pingLoading} targets={pingTargets} />
        </div>
        <SectionLabel text="Security & Connection Blocking" />
        <div className="cards-grid cols-1">
          <BlockCheckCard data={blockData} loading={blockLoading} items={blockItems} />
          <VerdictCard data={verdictData} loading={verdictLoading} />
        </div>
        {showSummary && <SummaryBar {...summary} />}
        <footer className="footer">
          <p>NetScan — Network Diagnostics &middot; All tests run in your browser &middot; No data stored</p>
        </footer>
      </div>
    </>
  );
}
