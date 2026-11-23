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
import { BillingAddress } from '@hanui/react';

export default function BillingAddressPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Billing Address"
        description="배송지/청구지 주소를 입력하는 블록"
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
              <BillingAddress
                onSubmit={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { BillingAddress } from '@/components/hanui/blocks/billing-address'

<BillingAddress
  onSubmit={(data) => {
    console.log(data);
    // { name, address, city, state, zipCode, country }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="billing-address" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { BillingAddress } from '@/components/hanui/blocks/billing-address'

export default function CheckoutPage() {
  const handleAddress = (data: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  }) => {
    // 주소 저장 API 호출 등 로직
    console.log(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <BillingAddress onSubmit={handleAddress} />
    </div>
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading level="h3" id="custom-title" title="제목/설명 변경" />
              <ComponentPreview>
                <BillingAddress
                  title="배송지 입력"
                  description="상품을 받으실 주소를 입력하세요."
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<BillingAddress
  title="배송지 입력"
  description="상품을 받으실 주소를 입력하세요."
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading
                level="h3"
                id="save-default"
                title="기본 주소 저장 옵션"
              />
              <ComponentPreview>
                <BillingAddress showSaveDefault />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<BillingAddress showSaveDefault />`}
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
                    폼 제출 핸들러. data에 name, address, city, state, zipCode,
                    country 포함
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
                    <Code>&quot;청구지 주소&quot;</Code>
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
                    <Code>&quot;청구지 주소를 입력하세요.&quot;</Code>
                  </TableCell>
                  <TableCell>카드 설명 텍스트</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>showSaveDefault</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>false</Code>
                  </TableCell>
                  <TableCell>기본 주소로 저장 체크박스 표시 여부</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
