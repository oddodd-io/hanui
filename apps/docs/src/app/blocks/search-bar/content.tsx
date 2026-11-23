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
import { SearchBar } from '@hanui/react';

export default function SearchBarPage() {
  return (
    <>
      <Heading
        level="h1"
        title="Search Bar"
        description="카테고리 필터가 포함된 검색 바 블록"
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
              <SearchBar
                onSearch={(data) => {
                  alert(JSON.stringify(data, null, 2));
                }}
              />
            </ComponentPreview>
            <FrameworkCodeBlock
              reactCode={`import { SearchBar } from '@/components/hanui/blocks/search-bar'

<SearchBar
  onSearch={(data) => {
    console.log(data);
    // { keyword, category }
  }}
/>`}
            />
          </Section>

          <Section level="h2">
            <Installation componentName="search-bar" />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="usage" title="사용법" />
            <FrameworkCodeBlock
              reactCode={`import { SearchBar } from '@/components/hanui/blocks/search-bar'

export default function SearchPage() {
  const handleSearch = (data: {
    keyword: string;
    category: string;
  }) => {
    // 검색 API 호출
    console.log(data);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}`}
            />
          </Section>

          <Section level="h2">
            <Heading level="h2" id="customization" title="커스터마이징" />

            <Subsection>
              <Heading
                level="h3"
                id="custom-categories"
                title="카테고리 변경"
              />
              <ComponentPreview>
                <SearchBar
                  categories={['전체', '민원', '복지', '교육', '세금']}
                  placeholder="검색어를 입력하세요"
                />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SearchBar
  categories={['전체', '민원', '복지', '교육', '세금']}
  placeholder="검색어를 입력하세요"
/>`}
              />
            </Subsection>

            <Subsection>
              <Heading level="h3" id="hide-category" title="카테고리 숨기기" />
              <ComponentPreview>
                <SearchBar showCategory={false} />
              </ComponentPreview>
              <FrameworkCodeBlock
                reactCode={`<SearchBar showCategory={false} />`}
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
                    <Code>onSearch</Code>
                  </TableCell>
                  <TableCell>
                    <Code>(data) =&gt; void</Code>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    검색 실행 핸들러. data에 keyword, category 포함
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>categories</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string[]</Code>
                  </TableCell>
                  <TableCell>
                    <Code>[&quot;전체&quot;, &quot;서비스&quot;, ...]</Code>
                  </TableCell>
                  <TableCell>카테고리 필터 목록</TableCell>
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
                    <Code>placeholder</Code>
                  </TableCell>
                  <TableCell>
                    <Code>string</Code>
                  </TableCell>
                  <TableCell>
                    <Code>&quot;검색어를 입력하세요&quot;</Code>
                  </TableCell>
                  <TableCell>검색 입력 필드 placeholder</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Code>showCategory</Code>
                  </TableCell>
                  <TableCell>
                    <Code>boolean</Code>
                  </TableCell>
                  <TableCell>
                    <Code>true</Code>
                  </TableCell>
                  <TableCell>카테고리 필터 표시 여부</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
}
