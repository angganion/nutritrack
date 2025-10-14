'use client';

import { ArrowLeft, Lightbulb, Clock, Users, DollarSign, CheckCircle, AlertTriangle, Info, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface StatsData {
  level: 'country' | 'province' | 'city' | 'district';
  location: string | { province: string; city?: string; district?: string };
  totalChildren: number;
  totalStunting: number;
  stuntingRate: string;
  longitude?: number;
  latitude?: number;
  groupedByProvince?: any[];
  groupedByCity?: any[];
  groupedByDistrict?: any[];
  data: any[];
}

interface RecommendationData {
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  summary: string;
  actionPlan: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  stakeholders: string[];
  budgetEstimate?: string;
}

interface RecommendationResponse {
  success: boolean;
  region: {
    level: string;
    location: string | { province: string; city?: string; district?: string };
    totalChildren: number;
    totalStunting: number;
    stuntingRate: string;
  };
  recommendations: RecommendationData;
}

export default function RecommendationsPage() {
  const params = useParams();
  const router = useRouter();
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState('Loading data...');
  const [error, setError] = useState<string | null>(null);

  // Construct the API path from params
  const pathSegments = params.params as string[];
  const apiPath = pathSegments.length === 0 ? 'all' : pathSegments.join('/');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingStep('Fetching region data...');
        
        // Fetch stats data first
        const statsResponse = await fetch(`/api/stats/${apiPath}`);
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch stats data');
        }
        const statsResult = await statsResponse.json();
        setStatsData(statsResult);

        setLoadingStep('Generating AI recommendations...');
        
        // Fetch recommendations using the integrated endpoint
        const recommendationsResponse = await fetch(`/api/stats-with-recommendations/${apiPath}`);
        if (!recommendationsResponse.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const recommendationsResult = await recommendationsResponse.json();
        
        if (recommendationsResult.recommendations) {
          setRecommendations(recommendationsResult.recommendations);
          setLoadingStep('Finalizing recommendations...');
        } else {
          throw new Error('No recommendations available');
        }
        
        // Small delay to show the final step
        setTimeout(() => {
          setLoading(false);
        }, 500);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, [apiPath]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="w-5 h-5" />;
      case 'medium': return <Info className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm">
          <div className="flex items-center">
            <Link href="/dashboard/distribution" className="text-blue-600 hover:text-blue-800">
              Indonesia
            </Link>
          </div>
          <span className="text-gray-400 mx-2">/</span>
          <span className="text-gray-900 font-medium">Recommendations</span>
        </nav>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-8 h-8" />
              Policy Recommendations
            </h1>
            <p className="text-gray-600 mt-1">
              AI-powered recommendations for stunting intervention
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div>
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
            disabled
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Distribution Map
          </Button>
        </div>

        {/* Loading State */}
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <Lightbulb className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">Generating Recommendations</h2>
            <p className="text-gray-600">{loadingStep}</p>
          </div>

          {/* Loading Steps */}
          <div className="w-full max-w-md space-y-3">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${loadingStep.includes('Fetching region data') ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${loadingStep.includes('Fetching region data') ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                {loadingStep.includes('Fetching region data') ? <Loader2 className="w-4 h-4 animate-spin" /> : '1'}
              </div>
              <span className={`text-sm ${loadingStep.includes('Fetching region data') ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>
                Fetching region data
              </span>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-lg ${loadingStep.includes('Generating AI recommendations') ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${loadingStep.includes('Generating AI recommendations') ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                {loadingStep.includes('Generating AI recommendations') ? <Loader2 className="w-4 h-4 animate-spin" /> : '2'}
              </div>
              <span className={`text-sm ${loadingStep.includes('Generating AI recommendations') ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>
                Generating AI recommendations
              </span>
            </div>

            <div className={`flex items-center gap-3 p-3 rounded-lg ${loadingStep.includes('Finalizing recommendations') ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${loadingStep.includes('Finalizing recommendations') ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
                {loadingStep.includes('Finalizing recommendations') ? <Loader2 className="w-4 h-4 animate-spin" /> : '3'}
              </div>
              <span className={`text-sm ${loadingStep.includes('Finalizing recommendations') ? 'text-blue-900 font-medium' : 'text-gray-600'}`}>
                Finalizing recommendations
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>This may take a few moments while our AI analyzes the data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !statsData || !recommendations) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Recommendations</h2>
          <p className="text-gray-600 mb-4">{error || 'No recommendations available'}</p>
          <Button onClick={() => router.push('/dashboard/distribution')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Distribution Map
          </Button>
        </div>
      </div>
    );
  }

  // Determine the current level and breadcrumb
  const getBreadcrumb = () => {
    const breadcrumbs: { name: string; href: string | null }[] = [
      { name: 'Indonesia', href: '/dashboard/distribution' }
    ];

    if (statsData.level === 'province') {
      breadcrumbs.push({ name: statsData.location as string, href: `/dashboard/distribution/${encodeURIComponent(statsData.location as string)}` });
    } else if (statsData.level === 'city') {
      const location = statsData.location as { province: string; city: string };
      breadcrumbs.push(
        { name: location.province, href: `/dashboard/distribution/${encodeURIComponent(location.province)}` },
        { name: location.city, href: `/dashboard/distribution/${encodeURIComponent(location.province)}/${encodeURIComponent(location.city)}` }
      );
    } else if (statsData.level === 'district') {
      const location = statsData.location as { province: string; city: string; district: string };
      breadcrumbs.push(
        { name: location.province, href: `/dashboard/distribution/${encodeURIComponent(location.province)}` },
        { name: location.city, href: `/dashboard/distribution/${encodeURIComponent(location.province)}/${encodeURIComponent(location.city)}` },
        { name: location.district, href: `/dashboard/distribution/${encodeURIComponent(location.province)}/${encodeURIComponent(location.city)}/${encodeURIComponent(location.district)}` }
      );
    }

    breadcrumbs.push({ name: 'Recommendations', href: null });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumb();

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="text-gray-400 mx-2">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="text-blue-600 hover:text-blue-800">
                {crumb.name}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">{crumb.name}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-8 h-8" />
            Policy Recommendations
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered recommendations for {statsData.level === 'country' ? 'Indonesia' : 
             statsData.level === 'province' ? statsData.location :
             statsData.level === 'city' ? (statsData.location as any).city :
             (statsData.location as any).district} stunting intervention
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Children: {statsData.totalChildren}</p>
          <p className="text-sm text-gray-600">Stunting Rate: {statsData.stuntingRate}%</p>
        </div>
      </div>

      {/* Back Button */}
      <div>
        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Distribution Map
        </Button>
      </div>

      {/* Priority & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-full ${getPriorityColor(recommendations.priority)}`}>
              {getPriorityIcon(recommendations.priority)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Priority Level</h3>
              <p className={`text-2xl font-bold capitalize ${getPriorityColor(recommendations.priority).split(' ')[0]}`}>
                {recommendations.priority}
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {recommendations.priority === 'high' && 'Immediate intervention required'}
            {recommendations.priority === 'medium' && 'Attention needed, plan intervention'}
            {recommendations.priority === 'low' && 'Maintain current programs'}
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Situation Summary</h3>
            </div>
          </div>
          <p className="text-gray-700">{recommendations.summary}</p>
        </Card>
      </div>

      {/* Main Recommendations */}
      <Card className="p-6 bg-white shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Key Recommendations
        </h2>
        <div className="space-y-3">
          {recommendations.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <p className="text-gray-800">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-green-600" />
            Short Term (1-6 months)
          </h3>
          <div className="space-y-2">
            {recommendations.actionPlan.shortTerm.map((action, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Medium Term (6-18 months)
          </h3>
          <div className="space-y-2">
            {recommendations.actionPlan.mediumTerm.map((action, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Long Term (18+ months)
          </h3>
          <div className="space-y-2">
            {recommendations.actionPlan.longTerm.map((action, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Stakeholders & Budget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Key Stakeholders
          </h3>
          <div className="space-y-2">
            {recommendations.stakeholders.map((stakeholder, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <p className="text-gray-700">{stakeholder}</p>
              </div>
            ))}
          </div>
        </Card>

        {recommendations.budgetEstimate && (
          <Card className="p-6 bg-white shadow-lg border border-gray-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Budget Estimate
            </h3>
            <p className="text-gray-700">{recommendations.budgetEstimate}</p>
          </Card>
        )}
      </div>
    </div>
  );
}