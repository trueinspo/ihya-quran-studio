import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'
import {
  useCourses,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from '@/lib/queries/courses'
import {
  useLessons,
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from '@/lib/queries/lessons'
import { Course, CourseCategory, Lesson } from '@/lib/supabase'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

// ── Shared input field ────────────────────────────────────────────────────────

function Field({
  label, value, onChange, textarea,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
}) {
  const cls =
    'w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all'
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  )
}

// ── Lessons Sheet ─────────────────────────────────────────────────────────────

type LessonForm = { title_ar: string; title_en: string; duration: string }
const emptyLessonForm: LessonForm = { title_ar: '', title_en: '', duration: '' }

function LessonsSheet({
  course, open, onClose,
}: {
  course: Course
  open: boolean
  onClose: () => void
}) {
  const { t } = useTranslation()
  const { data: lessons = [], isLoading } = useLessons(course.id)
  const createLesson = useCreateLesson()
  const updateLesson = useUpdateLesson()
  const deleteLesson = useDeleteLesson()
  const [form, setForm] = useState<LessonForm>(emptyLessonForm)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Lesson | null>(null)

  const handleSave = async () => {
    if (!form.title_ar.trim()) return
    if (editId) {
      await updateLesson.mutateAsync({ id: editId, course_id: course.id, ...form })
      setEditId(null)
    } else {
      await createLesson.mutateAsync({
        course_id: course.id,
        title_ar: form.title_ar,
        title_en: form.title_en,
        duration: form.duration || null,
        order: lessons.length + 1,
      })
    }
    setForm(emptyLessonForm)
  }

  const startEdit = (lesson: Lesson) => {
    setEditId(lesson.id)
    setForm({
      title_ar: lesson.title_ar,
      title_en: lesson.title_en,
      duration: lesson.duration ?? '',
    })
  }

  const cancelEdit = () => {
    setEditId(null)
    setForm(emptyLessonForm)
  }

  const isPending = createLesson.isPending || updateLesson.isPending

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="w-[520px] sm:max-w-[520px] overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle className="font-arabic text-base">
              {t('admin.manage_lessons')} — <span className="text-primary">{course.title_ar}</span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Add/Edit form */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-3 border border-border">
              <h3 className="text-sm font-semibold text-foreground font-arabic">
                {editId ? t('admin.edit_lesson') : t('admin.add_lesson')}
              </h3>
              <Field
                label={t('admin.lesson_title_ar')}
                value={form.title_ar}
                onChange={(v) => setForm((f) => ({ ...f, title_ar: v }))}
              />
              <Field
                label={t('admin.lesson_title_en')}
                value={form.title_en}
                onChange={(v) => setForm((f) => ({ ...f, title_en: v }))}
              />
              <Field
                label={t('admin.duration')}
                value={form.duration}
                onChange={(v) => setForm((f) => ({ ...f, duration: v }))}
              />
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!form.title_ar.trim() || isPending}
                  className="font-arabic"
                >
                  {isPending ? '...' : t('admin.save')}
                </Button>
                {editId && (
                  <Button size="sm" variant="ghost" onClick={cancelEdit} className="font-arabic">
                    {t('admin.cancel')}
                  </Button>
                )}
              </div>
            </div>

            {/* Lessons list */}
            <div className="space-y-2">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
                ))
              ) : lessons.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8 font-arabic">
                  لا توجد دروس بعد. أضف أول درس أعلاه.
                </p>
              ) : (
                lessons.map((lesson, i) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border bg-card transition-colors ${
                      editId === lesson.id ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <span className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground font-arabic truncate">
                        {lesson.title_ar}
                      </p>
                      {lesson.duration && (
                        <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                      )}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={() => startEdit(lesson)}
                      >
                        <Pencil size={12} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(lesson)}
                      >
                        <Trash2 size={12} />
                      </Button>
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
            <AlertDialogDescription className="font-arabic">
              {t('admin.confirm_delete_msg')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-arabic">{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-arabic"
              onClick={async () => {
                if (deleteTarget) {
                  await deleteLesson.mutateAsync({ id: deleteTarget.id, course_id: course.id })
                  setDeleteTarget(null)
                }
              }}
            >
              {t('admin.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ── Main AdminCourses ─────────────────────────────────────────────────────────

type CourseForm = {
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  category: CourseCategory
  is_free: boolean
}

const emptyCourseForm: CourseForm = {
  title_ar: '',
  title_en: '',
  description_ar: '',
  description_en: '',
  category: 'tajweed',
  is_free: true,
}

const AdminCourses = () => {
  const { t } = useTranslation()
  const { data: courses = [], isLoading } = useCourses()
  const createCourse = useCreateCourse()
  const updateCourse = useUpdateCourse()
  const deleteCourse = useDeleteCourse()

  const [courseSheetOpen, setCourseSheetOpen] = useState(false)
  const [editCourse, setEditCourse] = useState<Course | null>(null)
  const [lessonsCourse, setLessonsCourse] = useState<Course | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Course | null>(null)
  const [form, setForm] = useState<CourseForm>(emptyCourseForm)

  const openCreate = () => {
    setEditCourse(null)
    setForm(emptyCourseForm)
    setCourseSheetOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditCourse(course)
    setForm({
      title_ar: course.title_ar,
      title_en: course.title_en,
      description_ar: course.description_ar,
      description_en: course.description_en,
      category: course.category,
      is_free: course.is_free,
    })
    setCourseSheetOpen(true)
  }

  const handleSaveCourse = async () => {
    if (!form.title_ar.trim()) return
    if (editCourse) {
      await updateCourse.mutateAsync({ id: editCourse.id, ...form })
    } else {
      await createCourse.mutateAsync({
        ...form,
        lesson_count: 0,
        student_count: 0,
        image_url: null,
      })
    }
    setCourseSheetOpen(false)
  }

  const isSaving = createCourse.isPending || updateCourse.isPending

  const categoryLabel: Record<string, string> = {
    tajweed: t('courses_page.filter_tajweed'),
    qiraat: t('courses_page.filter_qiraat'),
    adab: t('courses_page.filter_adab'),
  }

  return (
    <div dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-arabic">{t('admin.courses')}</h1>
          <p className="text-sm text-muted-foreground font-arabic mt-1">
            {courses.length} {t('admin.total_courses')}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2 font-arabic">
          <Plus size={16} />
          {t('admin.add_course')}
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground font-arabic">
          {t('admin.no_courses')}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-right px-5 py-3 font-medium text-muted-foreground font-arabic">
                  {t('admin.course_title')}
                </th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground font-arabic">
                  {t('admin.category')}
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground font-arabic">
                  {t('admin.lessons_count')}
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground font-arabic">
                  {t('admin.total_students')}
                </th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground font-arabic">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground font-arabic">{course.title_ar}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{course.title_en}</p>
                    {course.is_free && (
                      <Badge variant="secondary" className="mt-1 text-xs font-arabic">
                        {t('courses_section.free')}
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant="outline" className="font-arabic text-xs">
                      {categoryLabel[course.category]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-center text-foreground/70">{course.lesson_count}</td>
                  <td className="px-4 py-3.5 text-center text-foreground/70">{course.student_count}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-xs font-arabic h-8"
                        onClick={() => setLessonsCourse(course)}
                      >
                        <BookOpen size={12} />
                        {t('admin.manage_lessons')}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => openEdit(course)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(course)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Course Create/Edit Sheet */}
      <Sheet open={courseSheetOpen} onOpenChange={setCourseSheetOpen}>
        <SheetContent side="left" className="w-[480px] sm:max-w-[480px] overflow-y-auto" dir="rtl">
          <SheetHeader>
            <SheetTitle className="font-arabic">
              {editCourse ? t('admin.edit_course') : t('admin.add_course')}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            <Field
              label={t('admin.title_ar')}
              value={form.title_ar}
              onChange={(v) => setForm((f) => ({ ...f, title_ar: v }))}
            />
            <Field
              label={t('admin.title_en')}
              value={form.title_en}
              onChange={(v) => setForm((f) => ({ ...f, title_en: v }))}
            />
            <Field
              label={t('admin.desc_ar')}
              value={form.description_ar}
              onChange={(v) => setForm((f) => ({ ...f, description_ar: v }))}
              textarea
            />
            <Field
              label={t('admin.desc_en')}
              value={form.description_en}
              onChange={(v) => setForm((f) => ({ ...f, description_en: v }))}
              textarea
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground font-arabic">
                {t('admin.category')}
              </label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v as CourseCategory }))}
              >
                <SelectTrigger dir="rtl" className="font-arabic">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="tajweed" className="font-arabic">
                    {t('courses_page.filter_tajweed')}
                  </SelectItem>
                  <SelectItem value="qiraat" className="font-arabic">
                    {t('courses_page.filter_qiraat')}
                  </SelectItem>
                  <SelectItem value="adab" className="font-arabic">
                    {t('courses_page.filter_adab')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3 py-1">
              <Switch
                id="is-free"
                checked={form.is_free}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_free: v }))}
              />
              <Label htmlFor="is-free" className="font-arabic cursor-pointer">
                {t('admin.is_free')}
              </Label>
            </div>
          </div>

          <SheetFooter className="mt-8 flex gap-2">
            <Button
              onClick={handleSaveCourse}
              disabled={!form.title_ar.trim() || isSaving}
              className="font-arabic"
            >
              {isSaving ? '...' : t('admin.save')}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCourseSheetOpen(false)}
              className="font-arabic"
            >
              {t('admin.cancel')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete Course Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-arabic">{t('admin.confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription className="font-arabic">
              {t('admin.confirm_delete_msg')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-arabic">{t('admin.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-arabic"
              onClick={async () => {
                if (deleteTarget) {
                  await deleteCourse.mutateAsync(deleteTarget.id)
                  setDeleteTarget(null)
                }
              }}
            >
              {t('admin.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Lessons Sheet */}
      {lessonsCourse && (
        <LessonsSheet
          course={lessonsCourse}
          open={!!lessonsCourse}
          onClose={() => setLessonsCourse(null)}
        />
      )}
    </div>
  )
}

export default AdminCourses
