'use client';

import {
  PageSection as Section,
  Heading,
  Subsection,
} from '@/components/content';
import { Installation } from '@/components/content/Installation';
import { FrameworkCodeBlock } from '@/components/content/FrameworkCodeBlock';
import { ComponentPreview } from '@/components/content/ComponentPreview';
import {
  Code,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@hanui/react';
import { PricingTable } from '@hanui/react';

export default function PricingTablePage() {
  return (
    <>
      <Heading
        level="h1"
        title="Pricing Table"
        description="플랜 비교 및 선택이 가능한 가격표 블록"
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="api">API 레퍼런스</TabsTrigger>
        </TabsList>

        {/* 개요 탭 */}
        <TabsContent value="overview">
          <Section level="h2">
            <Heading
              level="h2"
              id="overview"
              title="개요"
              className="sr-only"
            />
            <ComponentPreview>
              <PricingTable onSelect={(plan) => alert('선택: ' + plan)} />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { PricingTable } from '@/components/hanui/blocks/pricing-table'

<PricingTable onSelect={(plan) => alert('선택: ' + plan)} />`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="pricing-table" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { PricingTable } from '@/components/hanui/blocks/pricing-table'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '₩0',
      period: '월',
      description: '개인 프로젝트에 적합',
      features: ['프로젝트 3개', '기본 분석', '커뮤니티 지원'],
    },
    {
      name: 'Pro',
      price: '₩29,000',
      period: '월',
      description: '성장하는 팀을 위한 플랜',
      features: ['프로젝트 무제한', '고급 분석', '우선 지원', '커스텀 도메인'],
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '문의',
      period: '',
      description: '대규모 조직을 위한 맞춤형 솔루션',
      features: ['모든 Pro 기능', 'SSO/SAML', '전담 매니저', 'SLA 보장', '온프레미스 배포'],
    },
  ];

  return (
    <PricingTable
      plans={plans}
      onSelect={(planName) => console.log('선택한 플랜:', planName)}
    />
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="custom-plans" title="커스텀 플랜" />
              <ComponentPreview>
                <PricingTable
                  plans={[
                    {
                      name: 'Basic',
                      price: '₩9,900',
                      period: '월',
                      description: '소규모 팀용',
                      features: ['사용자 5명', '저장공간 10GB', '이메일 지원'],
                    },
                    {
                      name: 'Business',
                      price: '₩49,000',
                      period: '월',
                      description: '중소기업용',
                      features: [
                        '사용자 50명',
                        '저장공간 100GB',
                        '전화 지원',
                        'API 접근',
                      ],
                      popular: true,
                    },
                  ]}
                  onSelect={(plan) => alert('선택: ' + plan)}
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<PricingTable
  plans={[
    {
      name: 'Basic',
      price: '₩9,900',
      period: '월',
      description: '소규모 팀용',
      features: ['사용자 5명', '저장공간 10GB', '이메일 지원'],
    },
    {
      name: 'Business',
      price: '₩49,000',
      period: '월',
      description: '중소기업용',
      features: ['사용자 50명', '저장공간 100GB', '전화 지원', 'API 접근'],
      popular: true,
    },
  ]}
  onSelect={(plan) => console.log('선택:', plan)}
/>`}
              />
            </Subsection>
          </Section>
        </TabsContent>

        {/* API 레퍼런스 탭 */}
        <TabsContent value="api">
          <Section level="h2">
            <Heading level="h2" id="props" title="Props" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Code>plans</Code>
                  </TableCell>
                  <TableCell>
                    <Code>PricingPlan[]</Code>
                  </TableCell>
                  <TableCell>기본 예시 데이터</TableCell>
                  <TableCell>가격 플랜 배열</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>onSelect</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(plan: string) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    플랜 선택 핸들러. 선택한 플랜 이름을 인자로 전달
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>className</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>추가 CSS 클래스</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>

          <Section level="h2">
            <Heading level="h2" id="pricing-plan" title="PricingPlan" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Code>name</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>플랜 이름</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>price</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>가격 텍스트 (예: &quot;₩29,000&quot;)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>period</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    결제 주기 (예: &quot;월&quot;, &quot;년&quot;)
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>플랜 설명</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>features</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string[]</Code>
                  </TableCell>
                  <TableCell>포함된 기능 목록</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>popular</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>인기 플랜 뱃지 표시 여부 (선택)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
