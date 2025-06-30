'use client';

import { useState } from 'react';
import { Calculator, Users, TrendingUp, DollarSign, Clock, Award, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BoltBadge from '@/components/BoltBadge';

interface Cofounder {
  id: string;
  name: string;
  cashContribution: number;
  timeContribution: number; // hours per week
  marketSalary: number; // annual salary they're giving up
  ideaValue: number;
  riskMultiplier: number;
}

interface EquityResult {
  cofounder: Cofounder;
  slices: number;
  percentage: number;
  dollarValue: number;
}

export default function Home() {
  const [cofounders, setCofounders] = useState<Cofounder[]>([
    {
      id: '1',
      name: 'Cofounder 1',
      cashContribution: 0,
      timeContribution: 40,
      marketSalary: 120000,
      ideaValue: 0,
      riskMultiplier: 1
    }
  ]);
  
  const [companyValuation, setCompanyValuation] = useState(1000000);
  const [timeHorizon, setTimeHorizon] = useState(12); // months
  const [results, setResults] = useState<EquityResult[]>([]);

  const addCofounder = () => {
    const newId = (cofounders.length + 1).toString();
    setCofounders([...cofounders, {
      id: newId,
      name: `Cofounder ${newId}`,
      cashContribution: 0,
      timeContribution: 40,
      marketSalary: 120000,
      ideaValue: 0,
      riskMultiplier: 1
    }]);
  };

  const updateCofounder = (id: string, field: keyof Cofounder, value: string | number) => {
    setCofounders(cofounders.map(cf => 
      cf.id === id ? { ...cf, [field]: value } : cf
    ));
  };

  const removeCofounder = (id: string) => {
    if (cofounders.length > 1) {
      setCofounders(cofounders.filter(cf => cf.id !== id));
    }
  };

  const calculateEquity = () => {
    const totalSlices = cofounders.reduce((total, cf) => {
      // Cash contribution slices (1:1 ratio)
      const cashSlices = cf.cashContribution;
      
      // Time contribution slices (hourly rate based on market salary)
      const hourlyRate = cf.marketSalary / (52 * 40); // assuming 40 hours/week
      const timeSlices = (cf.timeContribution * 52 * (timeHorizon / 12)) * hourlyRate;
      
      // Idea value slices
      const ideaSlices = cf.ideaValue;
      
      // Apply risk multiplier
      const totalCfSlices = (cashSlices + timeSlices + ideaSlices) * cf.riskMultiplier;
      
      return total + totalCfSlices;
    }, 0);

    const equityResults: EquityResult[] = cofounders.map(cf => {
      const cashSlices = cf.cashContribution;
      const hourlyRate = cf.marketSalary / (52 * 40);
      const timeSlices = (cf.timeContribution * 52 * (timeHorizon / 12)) * hourlyRate;
      const ideaSlices = cf.ideaValue;
      const cfTotalSlices = (cashSlices + timeSlices + ideaSlices) * cf.riskMultiplier;
      
      const percentage = totalSlices > 0 ? (cfTotalSlices / totalSlices) * 100 : 0;
      const dollarValue = (percentage / 100) * companyValuation;

      return {
        cofounder: cf,
        slices: cfTotalSlices,
        percentage,
        dollarValue
      };
    });

    setResults(equityResults);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <BoltBadge />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <Calculator className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Startup Equity Split Calculator
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Fair and transparent equity distribution using the proven Slicing Pie framework
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Users className="h-4 w-4 mr-2" />
                Multiple Cofounders
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <TrendingUp className="h-4 w-4 mr-2" />
                Dynamic Calculations
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Award className="h-4 w-4 mr-2" />
                Slicing Pie Method
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="calculator" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-8">
            {/* Company Settings */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Company Settings
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Set your company's current valuation and time horizon
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="valuation">Company Valuation ($)</Label>
                    <Input
                      id="valuation"
                      type="number"
                      value={companyValuation}
                      onChange={(e) => setCompanyValuation(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeHorizon">Time Horizon (months)</Label>
                    <Input
                      id="timeHorizon"
                      type="number"
                      value={timeHorizon}
                      onChange={(e) => setTimeHorizon(Number(e.target.value))}
                      className="text-lg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cofounders */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Cofounders</h2>
                <Button onClick={addCofounder} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Users className="h-4 w-4 mr-2" />
                  Add Cofounder
                </Button>
              </div>

              {cofounders.map((cofounder, index) => (
                <Card key={cofounder.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        {cofounder.name}
                      </CardTitle>
                      {cofounders.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCofounder(cofounder.id)}
                          className="text-white hover:bg-white/20"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={cofounder.name}
                          onChange={(e) => updateCofounder(cofounder.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cash Contribution ($)</Label>
                        <Input
                          type="number"
                          value={cofounder.cashContribution}
                          onChange={(e) => updateCofounder(cofounder.id, 'cashContribution', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time Commitment (hrs/week)</Label>
                        <Input
                          type="number"
                          value={cofounder.timeContribution}
                          onChange={(e) => updateCofounder(cofounder.id, 'timeContribution', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Market Salary ($)</Label>
                        <Input
                          type="number"
                          value={cofounder.marketSalary}
                          onChange={(e) => updateCofounder(cofounder.id, 'marketSalary', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Idea Value ($)</Label>
                        <Input
                          type="number"
                          value={cofounder.ideaValue}
                          onChange={(e) => updateCofounder(cofounder.id, 'ideaValue', Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Risk Multiplier</Label>
                        <Input
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="5"
                          value={cofounder.riskMultiplier}
                          onChange={(e) => updateCofounder(cofounder.id, 'riskMultiplier', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                onClick={calculateEquity} 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3"
              >
                <Calculator className="h-5 w-5 mr-2" />
                Calculate Equity Split
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-8">
            {results.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-center text-gray-900">Equity Distribution Results</h2>
                
                <div className="grid gap-6">
                  {results.map((result, index) => (
                    <Card key={result.cofounder.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Award className="h-5 w-5" />
                            {result.cofounder.name}
                          </span>
                          <Badge variant="secondary" className="bg-white/20 text-white text-lg px-3 py-1">
                            {result.percentage.toFixed(2)}%
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-600">
                              {result.slices.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Total Slices</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {result.percentage.toFixed(2)}%
                            </div>
                            <div className="text-sm text-gray-600">Equity Share</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              ${result.dollarValue.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">Dollar Value</div>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-700">Cash</div>
                            <div className="text-gray-600">${result.cofounder.cashContribution.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Time/Week</div>
                            <div className="text-gray-600">{result.cofounder.timeContribution}h</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Market Salary</div>
                            <div className="text-gray-600">${result.cofounder.marketSalary.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">Risk Multiplier</div>
                            <div className="text-gray-600">{result.cofounder.riskMultiplier}x</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Info className="h-5 w-5" />
                      Summary
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {results.reduce((sum, r) => sum + r.slices, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Slices</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          ${companyValuation.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Company Valuation</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">
                          {timeHorizon} months
                        </div>
                        <div className="text-sm text-gray-600">Time Horizon</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Calculator className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Configure your cofounders and company settings, then calculate the equity split to see results here.
                  </p>
                  <Button 
                    onClick={() => {
                      const element = document.querySelector('[value="calculator"]') as HTMLElement;
                      element?.click();
                    }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Go to Calculator
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About the Slicing Pie Framework
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Understanding fair equity distribution for startups
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Slicing Pie?</h3>
                  <p className="text-gray-700 mb-4">
                    Slicing Pie is a dynamic equity split framework that ensures fair distribution of startup equity based on actual contributions rather than guesswork or negotiations.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">How it Works</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Cash Contributions</h4>
                      <p className="text-gray-600">Direct financial investments receive slices at a 1:1 ratio.</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Time Contributions</h4>
                      <p className="text-gray-600">Time invested valued at market salary rates for similar roles.</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Idea Value</h4>
                      <p className="text-gray-600">Initial concept and intellectual property contributions.</p>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Risk Multipliers</h4>
                      <p className="text-gray-600">Adjustments based on individual risk levels and circumstances.</p>
                    </div>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      This calculator provides estimates based on the Slicing Pie methodology. Always consult with legal and financial advisors before making final equity decisions.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-teal-50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Dynamic & Fair</h4>
                    <p className="text-gray-600 text-sm">Equity adjusts based on actual contributions over time</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Transparent</h4>
                    <p className="text-gray-600 text-sm">Clear methodology that all parties can understand</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="h-6 w-6 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Proven</h4>
                    <p className="text-gray-600 text-sm">Used by thousands of startups worldwide</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}