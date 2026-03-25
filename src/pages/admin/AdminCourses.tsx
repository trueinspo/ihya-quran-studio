import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Switch } from '@/components/ui/switch'
import { Course, CourseAccessType, CourseCategory, Lesson } from '@/lib/supabase'
import { useCourses, useCreateCourse, useDeleteCourse, useUpdateCourse } from '@/lib/queries/courses'
import { useCreateLesson, useDeleteLesson, useLessons, useUpdateLesson } from '@/lib/queries/lessons'

function toDateTimeLocal(value: string | null) {
  return value ? value.slice(0, 16) : ''
}

function toIsoDate(value: string) {
  return value ? new Date(value).toISOString() : null
}

type CourseForm = {
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  category: CourseCategory
  access_type: CourseAccessType
  price_usd: string
  is_published: boolean
  available_from: string
  available_until: string
}

const emptyCourseForm: CourseForm = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  category: 'tajweed',
  access_type: 'free',
  price_usd: '0',
  is_published: true,
  available_from: '',
  available_until: '',
}

type LessonForm = {
  title_ar: string
  title_en: string
  summary_ar: string
  summary_en: string
  content_ar: string
  content_en: string
  duration: string
  video_url: string
  is_preview: boolean
}

const emptyLessonForm: LessonForm = {
  title_ar: '',
  title_en: '',
  summary_ar: '',
  summary_en: '',
  content_ar: '',
  content_en: '',
  duration: '',
  video_url: '',
  is_preview: false,
}

function Field({ label, value, onChange, textarea, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; textarea?: boolean; type?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="font-arabic">{label}</Label>
      {textarea ? (
        <Textarea value={value} onChange={(event) => onChange(event.target.value)} className="font-arabic" />
      ) : (
        <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  )
}

function LessonsSheet({ course, open, onClose }: { course: Course; open: boolean; onClose: () => void }) {
  const { t } = useTranslation()
  const { data: lessons = [], isLoading } = useLessons(course.id)
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()
  const deleteLesson = useDeleteLesson()
  const [form, setForm] = useState<LessonForm>(emptyLessonForm)
  const [editLesson, setEditLesson] = useState<Lesson | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null)

  const resetForm = () => {
    setForm(emptyLessonForm)
    setEditLesson(null)
  }

  const handleSave = async () => {
    if (!form.title_ar.trim()) return

    const payload = {
      course_id: course.id,
      title_ar: form.title_ar,
      title_en: form.title_en,
      summary_ar: form.summary_ar,
      summary_en: form.summary_en,
      content_ar: form.content_ar,
      content_en: form.content_en,
      duration: form.duration || null,
      video_url: form.video_url || null,
      is_preview: form.is_preview,
      order: editLesson?.order ?? lessons.length + 1,
    }

    if (editLesson) {
      await updateLesson.mutateAsync({ id: editLesson.id, ...payload })
    } else {
      await createLesson.mutateAsync(payload)
    }

    resetForm()
  }

  const startEdit = (lesson: Lesson) => {
    setEditLesson(lesson)
    setForm({
      title_ar: lesson.title_ar,
      title_en: lesson.title_en,
      summary_ar: lesson.summary_ar,
      summary_en: lesson.summary_en,
      content_ar: lesson.content_ar,
      content_en: lesson.content_en,
      duration: lesson.duration ?? '',
      video_url: lesson.video_url ?? '',
      is_preview: lesson.is_preview,
    })
  }

  return (
    <>
      <Sheet open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
        <SheetContent side="left" className="w-[640px] sm:max-w-[640px] overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle className="font-arabic">{t('admin.manage_lessons')}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div className="rounded-2xl border border-border bg-muted/40 p-4 space-y-4">
              <h3 className="font-arabic font-semibold text-foreground">{editLesson ? t('admin.edit_lesson') : t('admin.add_lesson')}</h3>
              <Field label={t('admin.lesson_title_ar')} value={form.title_ar} onChange={(value) => setForm((current) => ({ ...current, title_ar: value }))} />
              <Field label={t('admin.lesson_title_en')} value={form.title_en} onChange={(value) => setForm((current) => ({ ...current, title_en: value }))} />
              <Field label={t('admin.lesson_summary_ar')} value={form.summary_ar} onChange={(value) => setForm((current) => ({ ...current, summary_ar: value }))} textarea />
              <Field label={t('admin.lesson_summary_en')} value={form.summary_en} onChange={(value) => setForm((current) => ({ ...current, summary_en: value }))} textarea />
              <Field label={t('admin.lesson_content_ar')} value={form.content_ar} onChange={(value) => setForm((current) => ({ ...current, content_ar: value }))} textarea />
              <Field label={t('admin.lesson_content_en')} value={form.content_en} onChange={(value) => setForm((current) => ({ ...current, content_en: value }))} textarea />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label={t('admin.duration')} value={form.duration} onChange={(value) => setForm((current) => ({ ...current, duration: value }))} />
                <Field label={t('admin.video_url')} value={form.video_url} onChange={(value) => setForm((current) => ({ ...current, video_url: value }))} />
              </div>
              <div className="flex items-center gap-3">
                <Switch id="lesson-preview" checked={form.is_preview} onCheckedChange={(checked) => setForm((current) => ({ ...current, is_preview: checked }))} />
                <Label htmlFor="lesson-preview" className="font-arabic">{t('lesson.preview')}</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={createLesson.isPending || updateLesson.isPending} className="font-arabic">{createLesson.isPending || updateLesson.isPending ? '...' : t('admin.save')}</Button>
                {editLesson && <Button variant="ghost" onClick={resetForm} className="font-arabic">{t('admin.cancel')}</Button>}
              </div>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                [1, 2, 3].map((item) => <div key={item} className="h-20 animate-pulse rounded-xl bg-muted" />)
              ) : (
                lessons.map((lesson, index) => (
                  <div key={lesson.id} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{index + 1}</span>
                          <p className="font-arabic font-medium text-foreground">{lesson.title_ar}</p>
                          {lesson.is_preview && <Badge variant="secondary" className="font-arabic">{t('lesson.preview')}</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{lesson.title_en}</p>
                        {lesson.summary_ar && <p className="text-sm text-muted-foreground font-arabic">{lesson.summary_ar}</p>}
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(lesson)}><Pencil size={14} /></Button>
                        <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(lesson)}><Trash2 size={14} /></Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-arabic">{t('admin.confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription className="font-arabic">{t('admin.confirm_delete_msg')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-arabic">{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-arabic" onClick={async () => {
              if (!deleteTarget) return
              await deleteLesson.mutateAsync({ id: deleteTarget.id, course_id: course.id })
              setDeleteTarget(null)
            }}>{t('admin.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

const AdminCourses = () => {
  const { t } = useTranslation()
  const { data: courses = [], isLoading } = useCourses()
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()
  const deleteCourse = useDeleteCourse()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [lessonsCourse, setLessonsCourse] = useState<Course | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [form, setForm] = useState<CourseForm>(emptyCourseForm)

  const accessLabels: Record<CourseAccessType, string> = {
    public: t('course.access_public'),
    free: t('course.access_free'),
    paid: t('course.access_paid'),
    private: t('course.access_private'),
    assigned: t('course.access_assigned'),
  }

  const openCreate = () => {
    setEditingCourse(null)
    setForm(emptyCourseForm)
    setSheetOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditingCourse(course)
    setForm({
      title_ar: course.title_ar,
      title_en: course.title_en,
      description_ar: course.description_ar,
      description_en: course.description_en,
      category: course.category,
      access_type: course.access_type,
      price_usd: String(course.price_usd ?? 0),
      is_published: course.is_published,
      available_from: toDateTimeLocal(course.available_from),
      available_until: toDateTimeLocal(course.available_until),
    })
    setSheetOpen(true)
  }

  const handleSaveCourse = async () => {
    if (!form.title_ar.trim()) return

    const numericPrice = form.access_type === 'paid' ? Number(form.price_usd || 0) : 0
    const payload = {
      title_ar: form.title_ar,
      title_en: form.title_en,
      description_ar: form.description_ar,
      description_en: form.description_en,
      category: form.category,
      access_type: form.access_type,
      price_usd: Number.isFinite(numericPrice) ? numericPrice : 0,
      is_free: form.access_type === 'free' || form.access_type === 'public',
      is_published: form.is_published,
      available_from: toIsoDate(form.available_from),
      available_until: toIsoDate(form.available_until),
      image_url: null,
      lesson_count: editingCourse?.lesson_count ?? 0,
      student_count: editingCourse?.student_count ?? 0,
    }

    if (editingCourse) {
      await updateCourse.mutateAsync({ id: editingCourse.id, ...payload })
    } else {
      await createCourse.mutateAsync(payload)
    }

    setSheetOpen(false)
    setEditingCourse(null)
    setForm(emptyCourseForm)
  }

  return (
    <div dir="rtl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">{t('admin.courses')}</h1>
          <p className="mt-1 text-sm text-muted-foreground font-arabic">{courses.length} {t('admin.total_courses')}</p>
        </div>
        <Button onClick={openCreate} className="gap-2 font-arabic"><Plus size={16} />{t('admin.add_course')}</Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((item) => <div key={item} className="h-16 animate-pulse rounded-xl bg-muted" />)}</div>
      ) : courses.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground font-arabic">{t('admin.no_courses')}</div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-right font-arabic text-muted-foreground">{t('admin.course_title')}</th>
                <th className="px-4 py-3 text-right font-arabic text-muted-foreground">{t('admin.category')}</th>
                <th className="px-4 py-3 text-right font-arabic text-muted-foreground">{t('admin.availability')}</th>
                <th className="px-4 py-3 text-center font-arabic text-muted-foreground">{t('admin.price')}</th>
                <th className="px-4 py-3 text-center font-arabic text-muted-foreground">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-5 py-4">
                    <p className="font-arabic font-medium text-foreground">{course.title_ar}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{course.title_en}</p>
                    <div className="mt-2 flex gap-2">
                      <Badge variant="outline" className="font-arabic">{accessLabels[course.access_type]}</Badge>
                      {!course.is_published && <Badge variant="secondary" className="font-arabic">{t('admin.unpublished')}</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-4"><Badge variant="outline" className="font-arabic">{t(`courses_page.filter_${course.category}`)}</Badge></td>
                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    <div className="space-y-1 font-arabic">
                      <p>{course.available_from ? `${t('admin.available_from')}: ${new Date(course.available_from).toLocaleDateString('ar-SA')}` : t('admin.available_now')}</p>
                      <p>{course.available_until ? `${t('admin.available_until')}: ${new Date(course.available_until).toLocaleDateString('ar-SA')}` : t('admin.no_end_date')}</p>
                      <p>{course.lesson_count} {t('admin.lessons_count')} • {course.student_count} {t('admin.total_students')}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-foreground tabular-nums">{course.access_type === 'paid' ? `$${course.price_usd}` : t('course.price_free')}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs font-arabic" onClick={() => setLessonsCourse(course)}><BookOpen size={12} />{t('admin.manage_lessons')}</Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(course)}><Pencil size={14} /></Button>
                      <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => setDeleteTarget(course)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="left" className="w-[560px] sm:max-w-[560px] overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle className="font-arabic">{editingCourse ? t('admin.edit_course') : t('admin.add_course')}</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <Field label={t('admin.title_ar')} value={form.title_ar} onChange={(value) => setForm((current) => ({ ...current, title_ar: value }))} />
            <Field label={t('admin.title_en')} value={form.title_en} onChange={(value) => setForm((current) => ({ ...current, title_en: value }))} />
            <Field label={t('admin.desc_ar')} value={form.description_ar} onChange={(value) => setForm((current) => ({ ...current, description_ar: value }))} textarea />
            <Field label={t('admin.desc_en')} value={form.description_en} onChange={(value) => setForm((current) => ({ ...current, description_en: value }))} textarea />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="font-arabic">{t('admin.category')}</Label>
                <Select value={form.category} onValueChange={(value) => setForm((current) => ({ ...current, category: value as CourseCategory }))}>
                  <SelectTrigger className="font-arabic"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="tajweed" className="font-arabic">{t('courses_page.filter_tajweed')}</SelectItem>
                    <SelectItem value="qiraat" className="font-arabic">{t('courses_page.filter_qiraat')}</SelectItem>
                    <SelectItem value="adab" className="font-arabic">{t('courses_page.filter_adab')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-arabic">{t('admin.availability')}</Label>
                <Select value={form.access_type} onValueChange={(value) => setForm((current) => ({ ...current, access_type: value as CourseAccessType }))}>
                  <SelectTrigger className="font-arabic"><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="public" className="font-arabic">{t('course.access_public')}</SelectItem>
                    <SelectItem value="free" className="font-arabic">{t('course.access_free')}</SelectItem>
                    <SelectItem value="paid" className="font-arabic">{t('course.access_paid')}</SelectItem>
                    <SelectItem value="private" className="font-arabic">{t('course.access_private')}</SelectItem>
                    <SelectItem value="assigned" className="font-arabic">{t('course.access_assigned')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t('admin.price')} value={form.price_usd} onChange={(value) => setForm((current) => ({ ...current, price_usd: value }))} type="number" />
              <div className="flex items-center gap-3 pt-7">
                <Switch id="published" checked={form.is_published} onCheckedChange={(checked) => setForm((current) => ({ ...current, is_published: checked }))} />
                <Label htmlFor="published" className="font-arabic">{t('admin.is_published')}</Label>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label={t('admin.available_from')} value={form.available_from} onChange={(value) => setForm((current) => ({ ...current, available_from: value }))} type="datetime-local" />
              <Field label={t('admin.available_until')} value={form.available_until} onChange={(value) => setForm((current) => ({ ...current, available_until: value }))} type="datetime-local" />
            </div>
          </div>

          <SheetFooter className="mt-8 flex gap-2">
            <Button onClick={handleSaveCourse} disabled={createCourse.isPending || updateCourse.isPending} className="font-arabic">{createCourse.isPending || updateCourse.isPending ? '...' : t('admin.save')}</Button>
            <Button variant="ghost" onClick={() => setSheetOpen(false)} className="font-arabic">{t('admin.cancel')}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-arabic">{t('admin.confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription className="font-arabic">{t('admin.confirm_delete_msg')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-arabic">{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-arabic" onClick={async () => {
              if (!deleteTarget) return
              await deleteCourse.mutateAsync(deleteTarget.id)
              setDeleteTarget(null)
            }}>{t('admin.delete')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {lessonsCourse && <LessonsSheet course={lessonsCourse} open={!!lessonsCourse} onClose={() => setLessonsCourse(null)} />}
    </div>
  )
}

export default AdminCourses
