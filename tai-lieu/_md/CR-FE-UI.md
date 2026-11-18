<!-- pk-source: Coding rule/CNMVHTDTMS_attachments (1)/FE_UI_COMPONENTS.md -->
<!-- pk-sha256: 2c6e7090392a185cc8c1bfa2753860c46156856e5933f56082d5841c964a7fd2 -->
<!-- pk-generated: 2026-11-11 bởi scripts/pk-md.py — KHÔNG sửa tay; sửa/thay tệp nguồn rồi chạy lại. -->

# CR-FE-UI — bản đọc máy sinh

> Nguồn: `project-knowledge/Coding rule/CNMVHTDTMS_attachments (1)/FE_UI_COMPONENTS.md`. Trích dẫn thì ghi mã **CR-FE-UI** và tệp nguồn, không trích bản đọc này. Bảng/định dạng có thể lệch so với bản gốc — khi số liệu quan trọng, mở tệp gốc để đối chiếu.

# FE UI Components: danh mục `@khcn-core/ui` cho repo-khcn-dtms-fe

> Tài liệu tra cứu cho rule **FE-UI-01**: phần tử nào đã có component trong `@khcn-core/ui` thì
> **bắt buộc** dùng component đó, không dùng thẻ HTML gốc hoặc PrimeNG trực tiếp.
>
> Mọi component dưới đây là **standalone**, import thẳng từ `'@khcn-core/ui'` vào `imports: [...]`.
> Các control form đều là `ControlValueAccessor`: dùng được với `[formControl]`, `formControlName`
> hoặc `[(ngModel)]`, ngoài ra có `model()` `value`/`disabled` để bind signal.
>
> Nguồn: `repo-khcn-core-fe/projects/ui/src/custom/vht-*`. Demo sống: app `repo-khcn-core-fe`
> (`/demo/...`). Nếu input nào không có trong bảng dưới thì đọc file `.component.ts` của lib trước khi
> dùng, **không đoán tên input**.
>
> ⚠️ **Không override style của bất kỳ `vht-*` nào từ bên ngoài** (FE-STY-02): không
> `[&_.vht-xxx]:...`, không `::ng-deep`, không `!bg/!border/!h/!p` lên thẻ host. Chỉ dùng input của
> component và class bố cục ngoài (`w-*`, `flex-1`, `m*-*`). Xem mục 8.

---

## 1. Bảng tra nhanh

| Nhu cầu trên prototype | Selector | Class import | Ghi chú |
|---|---|---|---|
| 1 dòng form: label + `*` + control + lỗi/hint | `vht-form-field` | `VhtFormFieldComponent` | Luôn bọc mọi control có label |
| Ô nhập text | `vht-text-input` | `VhtTextInputComponent` | |
| Ô nhập số | `vht-number-input` | `VhtNumberInputComponent` | Thay `TEXT + pattern` |
| Ô nhập nhiều dòng | `vht-textarea` | `VhtTextareaComponent` | |
| Dropdown chọn 1 | `vht-select` | `VhtSelectComponent` | Option: `VhtSelectOption` |
| Dropdown chọn nhiều | `vht-multi-select` | `VhtMultiSelectComponent` | Option: `VhtMultiSelectOption` |
| Dropdown dạng cây | `vht-tree-select` | `VhtTreeSelectComponent` | `TreeNode` của PrimeNG |
| Checkbox | `vht-checkbox` | `VhtCheckboxComponent` | Giá trị `boolean` |
| Nhóm radio | `vht-radio` | `VhtRadioComponent` | Option: `VhtRadioOption<T>` |
| Công tắc bật/tắt | `vht-switch` | `VhtSwitchComponent` | Giá trị `boolean` |
| Chọn ngày / khoảng ngày / giờ | `vht-calendar` | `VhtCalendarComponent` | |
| Nút chuẩn có nền/viền (Lưu, Hủy, Thêm mới…) | `vht-button` | `VhtButtonComponent` | Output là `(clicked)`, không phải `(click)` |
| Nút chỉ icon / chỉ chữ | `<button type="button">` native | — | Tailwind trên chính thẻ, xem 3.2 |
| Ô tìm kiếm | `vht-search-input` | `VhtSearchInputComponent` | Output `(search)` |
| Bảng danh sách | `vht-table` | `VhtTableComponent` | 1 input `[props]` |
| Bảng dạng cây | `vht-tree-table` | `VhtTreeTable` (không có hậu tố Component) | |
| Phân trang rời | `vht-paginator` | `VhtPaginatorComponent` | `vht-table` đã có sẵn paginator |
| Thanh tiến độ các bước | `vht-steps` | `VhtStepsComponent` | 1 input `[props]` |
| Dòng thời gian / lịch sử | `vht-timeline` | `VhtTimelineComponent` | |
| Khung popup | `vht-modal` + `VhtModalService` | `VhtModalComponent` | Mở từ facade |
| Popup xác nhận xóa / khóa / mở | `VhtConfirmService` | (service) | Không tự vẽ |
| Thông báo góc màn | `ToastService` | (service) | `success/error/warn/info` |
| Chọn cán bộ (cây đơn vị + danh sách) | `vht-employee-picker` | `VhtEmployeePickerComponent` | |
| Cây đơn vị | `vht-unit-tree` | `VhtUnitTree` (không có hậu tố Component) | |
| Danh sách tag/chip | `vht-tag-list` | `VhtTagListComponent` | |
| Upload / import file | `vht-import-file`, `vht-import-dialog` | `VhtImportFileComponent`, `VhtImportDialogComponent` | |
| Form động từ schema Camunda | `vht-e-form` | `VhtEFormComponent` | |
| Loading | `vht-loading` | `VhtLoadingComponent` | |
| Icon | `<i class="vht vht-<tên>">` | (font CSS) | Đã nạp sẵn trong `angular.json` |

Component dùng chung **trong repo dtms** (`src/app/components/`), cũng phải dùng lại, không viết bản mới:
`badge` (`BadgeComponent` từ `@components/badge/badge.component`, selector `<badge [variant]>`), `bpmn-viewer`, `pdf-preview-dialog`, `vht-pdf-view`, `access-denied`,
`templates/ellipsis-cell`, `templates/dialog-header`.

---

## 2. Form field + control

### 2.1 `vht-form-field`

Inputs: `label`, `required` (vẽ dấu `*`), `error` (chuỗi, có giá trị thì field chuyển trạng thái lỗi),
`hint`. Field tự sinh id và gắn `aria` cho control bên trong. **Không** tự viết `<label>`,
`<small class="text-red">`.

```html
<vht-form-field label="Mã nhiệm vụ" [required]="true" [error]="facade.fieldErrors().code">
  <vht-text-input formControlName="code" placeholder="Nhập mã nhiệm vụ" [maxLength]="codeMaxLength" />
</vht-form-field>
```

Message lỗi **không** lấy bằng method trong template (`facade.errorOf('code')` ❌, vi phạm FE-CMP-09).
Facade giữ 1 signal `fieldErrors` (vd `computed` từ `toSignal(form.events)` hoặc cập nhật khi submit),
template chỉ đọc `facade.fieldErrors().code`. Nội dung message lấy từ constants.

### 2.2 `vht-text-input`

Inputs: `placeholder`, `maxLength`, `size` (`'sm' | 'md'`), `autoUppercase`, `noSpecialLetter`,
`allowedChars`. Model: `value`, `disabled`.

```html
<vht-text-input formControlName="name" placeholder="Nhập tên" [maxLength]="255" />
<vht-text-input formControlName="code" autoUppercase noSpecialLetter />
```

### 2.3 `vht-number-input`

Inputs: `min`, `max`, `maxLength`, `step`, `minFractionDigits`, `maxFractionDigits`, `useGrouping`
(mặc định `true`), `prefix`, `suffix`, `mode` (`'decimal' | 'currency'`), `currency`, `locale`,
`showButtons`, `allowEmpty`. Giá trị: `number | null`.

```html
<vht-number-input formControlName="budget" [min]="0" suffix=" VNĐ" [maxFractionDigits]="0" />
```

### 2.4 `vht-textarea`

Inputs: `placeholder`, `maxLength`, `rows`.

```html
<vht-textarea formControlName="note" placeholder="Nội dung" [rows]="3" [maxLength]="1000" />
```

### 2.5 `vht-select`

Inputs: `options: VhtSelectOption[]` (`{ label, value }`), `placeholder`, `searchable`,
`searchPlaceholder`, `showClear`, `lazy`, `virtualScroll`, `loading`, `emptyMessage`. Outputs:
`(filterChange)`, `(lazyLoad)`, `(cleared)`. Giá trị: `string | number | null`.

```html
<vht-select formControlName="status" [options]="statusOptions" placeholder="Chọn trạng thái" showClear />

<!-- ngoài form (bộ lọc/sắp xếp): bind signal của facade -->
<vht-select class="w-[200px]" [options]="sortOptions" [ngModel]="facade.sort()"
            (ngModelChange)="facade.handleSortChange($event)" />
```

Options tĩnh khai báo trong `*.constants.ts`; options từ API là `computed()`/`signal()` trong facade.

### 2.6 `vht-multi-select`

Inputs: `options: VhtMultiSelectOption[]`, `placeholder`, `filter`, `showClear`, `emptyMessage`.
Output `(filterChange)`. Giá trị: `Array<string | number>`.

```html
<vht-multi-select formControlName="fieldIds" [options]="facade.fieldOptions()" placeholder="Chọn lĩnh vực" />
```

### 2.7 `vht-tree-select`

Inputs: `options: TreeNode[]`, `placeholder`, `filter`, `showClear`, `panelStyle`. Outputs:
`(onNodeExpand)`, `(onNodeUnselect)`, `(filterChange)`, `(onBlur)`. Giá trị: `TreeNode | null`.

```html
<vht-tree-select formControlName="unit" [options]="facade.unitTree()" placeholder="Chọn đơn vị"
                 (onNodeExpand)="facade.handleUnitExpand($event)" />
```

### 2.8 `vht-checkbox` / `vht-switch`

Inputs: `label`, `size`; `vht-checkbox` có thêm `indeterminate`. Model: `checked`, `disabled`.
Giá trị `boolean`.

```html
<vht-checkbox formControlName="isRequired" label="Bắt buộc" />
<vht-switch formControlName="isActive" label="Hoạt động" />
```

### 2.9 `vht-radio`

Inputs: `options: VhtRadioOption<T>[]`, `direction` (`'vertical' | 'horizontal'`), `name`, `size`.
Output `(valueChange)`.

```html
<vht-radio formControlName="level" [options]="levelOptions" direction="horizontal" />
```

### 2.10 `vht-calendar`

Inputs chính: `selectionMode` (`'single' | 'range' | 'multiple'`), `view`, `dateFormat`,
`placeholder`, `minDate`, `maxDate`, `showTime`, `timeOnly`, `showClear`, `appendTo`, `isRequired`,
`isInvalid`. Giá trị: `Date | Date[] | null`.

```html
<vht-form-field label="Thời gian thực hiện" [required]="true" [error]="facade.fieldErrors().period">
  <vht-calendar formControlName="period" selectionMode="range" placeholder="Từ ngày - Đến ngày" appendTo="body" />
</vht-form-field>
```

Format ngày khi gửi API / hiển thị: viết hàm trong `*.utils.ts`, hiển thị trong template dùng `DatePipe`.

---

## 3. Nút, tìm kiếm, icon

### 3.1 `vht-button`

Inputs: `variant` (`'primary' | 'secondary' | 'danger' | 'ghost' | 'active'`), `size` (`'sm' | 'md'`),
`type` (`'button' | 'submit' | 'reset'`), `disabled`, `ariaLabel`. Output: **`(clicked)`**.

```html
<vht-button variant="secondary" (clicked)="facade.handleCancel()">Hủy</vht-button>
<vht-button variant="primary" [disabled]="facade.isSaving()" (clicked)="facade.handleSave()">Lưu</vht-button>
<vht-button variant="danger" (clicked)="facade.handleDelete()">Xóa</vht-button>
```

Màu/viền/kích thước chỉ chọn qua `variant` + `size`. Không có variant khớp prototype thì dùng variant
gần nhất và ghi `TODO(A1)` (FE-STY-02). **Cấm**:

```html
<!-- ❌ ép style vht-button từ ngoài -->
<vht-button class="[&_.vht-button]:!border-[#EE0033] [&_.vht-button]:!text-[#EE0033]">Từ chối</vht-button>
<vht-button class="!h-7 !w-7 !p-0" variant="ghost"><i class="vht vht-edit"></i></vht-button>
```

### 3.2 Nút chỉ icon / chỉ chữ: `<button>` native (FE-UI-05)

Dùng cho: nút quay lại, sửa/xóa/xem trên dòng bảng, link-text ("Xem thêm"), item trong popover/menu.

```html
<!-- chỉ icon: bắt buộc aria-label -->
<button type="button" aria-label="Sửa" (click)="facade.handleEdit(rowData)"
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg hover:bg-[#f8f8fa]">
  <i class="vht vht-edit vht-md"></i>
</button>

<!-- chỉ chữ (item menu / link) -->
<button type="button" [disabled]="facade.isPending()" (click)="facade.handleAction(action)"
        class="w-full cursor-pointer rounded-lg bg-transparent px-3 py-2 text-left text-sm text-[#1A1C1E] hover:bg-[#f8f8fa] disabled:cursor-not-allowed disabled:opacity-40">
  {{ action.label }}
</button>
```

Nút native dùng `(click)` (không phải `(clicked)`). Class dài lặp lại nhiều chỗ thì gom thành constant
(FE-STY-03).

### 3.3 `vht-search-input`

Inputs: `placeholder`, `maxLength`, `width` (px), `size`, `showClear`. Model `value`. Output
`(search)` (Enter / bấm kính lúp / xóa).

```html
<vht-search-input [width]="320" [maxLength]="searchMaxLength" placeholder="Tìm kiếm theo mã, tên..."
                  [value]="facade.keywordValue()"
                  (valueChange)="facade.handleKeywordInput($event)"
                  (search)="facade.handleSearch($event)" />
```

`[value]` bind vào keyword **đã áp dụng** của facade (xem FE-FCD-09).

### 3.4 Icon `vht`

Font icon đã được nạp toàn cục (`@khcn-core/ui/styles/icons/vht-icons.css`). Tra tên icon ở trang demo
"Vht Icons" của `repo-khcn-core-fe`.

```html
<i class="vht vht-user"></i>            <!-- 20px mặc định -->
<i class="vht vht-user vht-sm"></i>     <!-- 14px; vht-md = 16px; vht-lg = 24px -->
<i class="vht vht-reload vht-spin"></i> <!-- xoay -->
<i class="vht vht-user text-[#16A34A]"></i> <!-- đổi màu bằng Tailwind, không dùng style inline -->
```

Không dùng `pi pi-*`, không dán SVG export từ Figma. Nếu font không có icon cần dùng, ghi
`// TODO(A1): thiếu icon <tên> trong vht-icons` và báo trong mô tả MR.

---

## 4. Bảng & phân trang

### 4.1 `vht-table`

Input duy nhất `[props]: VhtTableProps<T>`. Outputs: `(onPageChangeEvt)` (`VhtPaginatorState`),
`(rowClick)`, `(selectionChange)`, `(eventEmitFilter)`.

`VhtTableProps` chính: `dataSources`, `columns: VhtTableColumn<T>[][]`, `totalCount` (bắt buộc),
`currentPage`, `recordPerPage`, `rowsPerPageOptions`, `showPaginator`, `isShowOrder` (cột STT),
`isShowCheckBox`, `selection`, `dataKey`, `rowHover`, `isClickRecord`, `scrollHeight`, `loading`,
`emptyMessage`, `stickyStartColumn`, `stickyEndColumn`.

`VhtTableColumn` chính: `field`, `header`, `width`, `minWidth`, `maxWidth`, `customTemplate`,
`headerTemplate`, `tdClassName`, `thClassName`, `ellipsisRows`, `isSticky`, `isShowSort`.

Cách làm chuẩn (mẫu: `features/my-tasks/`):

1. **Utils**: `buildXxxColumns(templates)` trong `shared/utils/xxx-columns.utils.ts` trả về
   `VhtTableColumn<Row>[][]`. Tiêu đề cột lấy từ constants.
2. **Models**: `XxxColumnTemplates` (tập các `TemplateRef`) khai báo trong `*.models.ts`.
3. **Component**: `@ViewChild('statusCellTpl', { static: true })`, gọi
   `facade.setTemplates({...})` trong `ngOnInit`.
4. **Facade**: `readonly tableProps = computed<VhtTableProps<Row>>(() => ({ ... }))`.
5. **Template**:

```html
<vht-table class="flex-1" [props]="facade.tableProps()"
           (onPageChangeEvt)="facade.handlePageChange($event)"
           (rowClick)="facade.handleRowClick($event)" />

<!-- context ô: $implicit / data = giá trị ô, rowData = cả dòng, col = cột -->
<ng-template #statusCellTpl let-rowData="rowData">
  <badge [variant]="statusVariantMap[rowData.status]">{{ statusLabelMap[rowData.status] }}</badge>
</ng-template>
```

### 4.2 `vht-paginator`

Chỉ dùng khi danh sách **không** phải `vht-table` (vd danh sách dạng card). Inputs: `totalRecords`,
`currentPage`, `recordPerPage`, `rowsPerPageOptions`, `showPageSize`, `showTotal`. Output
`(onPageChange)`.

---

## 5. Popup, xác nhận, toast (gọi từ facade)

### 5.1 Mở popup: `VhtModalService` + `vht-modal`

```ts
// facade trang cha
private readonly modal = inject(VhtModalService);

handleCreate(): void {
  this.modal
    .open<TaskFormResult, TaskFormDialogData>(TaskFormDialogComponent, { size: 'md', data: { mode: TaskFormMode.Create } })
    .pipe(filter(Boolean))
    .subscribe(() => this.search());
}
```

`size`: `'xs' | 'sm' | 'md' | 'lg'` (`md` = 520px cho popup thêm/sửa). Form dài thì đặt
`closeOnEscape: false`.

Component dialog: `extends DialogRegistry` (`@core/base/dialog-registry`) để lấy `dialogData`,
`dialogRef`. Template bọc bằng `vht-modal`, nút đặt trong `slot="actions"`:

```html
<vht-modal title="Thêm mới nhiệm vụ" (closed)="facade.handleCancel()">
  <form [formGroup]="facade.form" class="flex flex-col gap-4">
    <vht-form-field label="Tên nhiệm vụ" [required]="true" [error]="facade.fieldErrors().name">
      <vht-text-input formControlName="name" />
    </vht-form-field>
  </form>

  <div class="flex items-center gap-2" slot="actions">
    <vht-button variant="secondary" (clicked)="facade.handleCancel()">Hủy</vht-button>
    <vht-button variant="primary" [disabled]="facade.isSaving()" (clicked)="facade.handleSave()">Lưu</vht-button>
  </div>
</vht-modal>
```

Mẫu thật: `features/my-tasks/my-task-detail/my-task-transfer-dialog/`.

### 5.2 Xác nhận: `VhtConfirmService`

Methods: `delete(params)`, `deactivate(params)`, `activate(params)`, `open(data)`, đều trả về
`Observable<boolean>`. `params: VhtConfirmParams = { entity, name, code? }`.

```ts
handleDelete(row: TaskListRow): void {
  this.confirm
    .delete({ entity: TASK_ENTITY_LABEL, name: row.name, code: row.code })
    .pipe(
      filter(Boolean),
      switchMap(() => this.service.deleteTask(row.id)),
      take(1),
    )
    .subscribe({
      next: () => { this.toast.success(TASK_MESSAGES.successTitle, TASK_MESSAGES.deleteSuccess); this.search(); },
      error: () => this.toast.error(TASK_MESSAGES.failTitle, TASK_MESSAGES.deleteFail),
    });
}
```

### 5.3 Thông báo: `ToastService`

`success(summary, detail?)`, `error(...)`, `warn(...)`, `info(...)`. Cả `summary` và `detail` lấy
từ constants.

---

## 6. Khác

- **`vht-steps`**: `[props]: VhtStepsProps` = `{ steps: VhtStep[], title?, ... }`;
  `VhtStep = { id, index, title, subTitle?, state: 'completed' | 'active' | 'upcoming' }`. Map dữ liệu
  API sang `VhtStep[]` bằng hàm trong utils, build props bằng `computed()` trong facade.
- **`vht-timeline`**, **`vht-tree-table`**, **`vht-unit-tree`**, **`vht-employee-picker`**,
  **`vht-tag-list`**, **`vht-import-file`**, **`vht-e-form`**: đọc `.component.ts` và trang demo
  tương ứng trong `repo-khcn-core-fe` trước khi dùng. Mẫu dùng `vht-employee-picker` và `vht-e-form` có
  sẵn trong `features/my-tasks/my-task-detail/`.

---

## 7. Khi `@khcn-core/ui` không có component phù hợp

1. Tìm thêm trong `src/app/components/` của dtms.
2. Nếu vẫn không có: dựng bằng `div` + Tailwind (layout) hoặc PrimeNG (control), ghi comment
   `<!-- Không có vht-* tương ứng: <lý do> -->` ngay trên phần tử (FE-UI-02).
3. Không tạo component dùng chung mới trong `src/app/components/` nếu SRS không yêu cầu. Liệt kê nhu cầu
   trong mô tả MR để team core bổ sung vào lib.

---

## 8. Không override style của `vht-*` (FE-STY-02, FE-STY-05)

Style của mọi component `@khcn-core/ui` do core-ui quản lý. Phía feature **chỉ** được:

| Được phép | Ví dụ |
|---|---|
| Input của component | `variant="danger"`, `size="md"`, `styleClass`/`panelStyle` (nếu component có) |
| Class bố cục ngoài trên thẻ host | `class="w-[200px]"`, `flex-1`, `shrink-0`, `mt-4`, `col-span-2` |

**Cấm** (kể cả khi code có sẵn trong repo đang làm vậy):

| Dạng vi phạm | Ví dụ |
|---|---|
| Arbitrary variant nhắm phần tử con | `[&_.vht-button]:!text-[#EE0033]`, `hover:[&_.vht-button]:!bg-[#FFF1F3]`, `[&_.vht-table\_\_viewport]:!h-[320px]` |
| `::ng-deep` / selector con cháu trong scss | `:host ::ng-deep .vht-select { ... }`, `.my-wrapper .vht-button { ... }` |
| `!important` đổi giao diện trên thẻ host | `<vht-button class="!h-7 !w-7 !p-0 !border-0">` |
| Chuỗi class override build trong `.ts` | `readonly rejectBtnClass = '[&_.vht-button]:!border-[#EE0033]'` |

Nếu input không tạo ra đúng giao diện prototype:
- Nút chỉ icon/chỉ chữ → dùng `<button>` native (mục 3.2). Hầu hết các override kiểu `!h-7 !w-7 !p-0`
  đều thuộc trường hợp này.
- Còn lại → dùng variant gần nhất + `// TODO(A1): cần variant <mô tả> cho <vht-xxx> trong core-ui`,
  báo trong mô tả MR. **Không hack.**
- `vht-*` hiển thị thiếu style (mất màu/viền) thường do `tailwind.config.js` của dtms chưa quét
  `node_modules/@khcn-core/ui/**/*.mjs`. Không bù bằng override, không tự sửa config (FE-STY-04). Báo
  trong MR.

File `.scss` của component chỉ được tạo để override thư viện **bên thứ ba khác** (PrimeNG dùng trực tiếp,
bpmn-js, pdf viewer…), không bao giờ để override `vht-*` (FE-STY-06).

Khi sửa một override, `grep '\[&_\.vht\|::ng-deep'` **toàn bộ** các file html/ts/scss đã chạm và xóa hết,
không chỉ dòng được chỉ ra.
