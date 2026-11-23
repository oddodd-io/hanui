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
import { PaymentCard } from '@hanui/react';

export default function PaymentCardPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Payment Card"
        description="카드번호, 유효기간, CVV를 입력하는 카드 결제 폼 블록"
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
              <PaymentCard
                onSubmit={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { PaymentCard } from '@/components/hanui/blocks/payment-card'

<PaymentCard
  onSubmit={(data) => {
    console.log(data);
    // { cardNumber, expiryDate, cvv, cardholderName }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="payment-card" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { PaymentCard } from '@/components/hanui/blocks/payment-card'

export default function CheckoutPage() {
  const handlePayment = (data: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  }) => {
    // 결제 API 호출 등 결제 로직
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <PaymentCard onSubmit={handlePayment} />
    </div>
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="with-amount" title="결제 금액 표시" />
              <ComponentPreview>
                <PaymentCard amount="₩29,000" />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<PaymentCard amount="₩29,000" />`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="custom-title" title="제목/설명 변경" />
              <ComponentPreview>
                <PaymentCard
                  title="정기 결제 등록"
                  description="매월 자동 결제할 카드를 등록하세요."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<PaymentCard
  title="정기 결제 등록"
  description="매월 자동 결제할 카드를 등록하세요."
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
                    <Code>onSubmit</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(data) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    폼 제출 핸들러. data에 cardNumber, expiryDate, cvv,
                    cardholderName 포함
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
                <TableRow>
                  <TableCell>
                    <Code>title</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;카드 결제&quot;</Code>
                  </TableCell>
                  <TableCell>카드 제목</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>description</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;카드 정보를 입력하세요.&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>amount</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    결제 금액 표시 텍스트 (예: &quot;₩29,000&quot;)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
