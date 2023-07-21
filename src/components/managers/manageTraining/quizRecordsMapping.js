export default [
    {
        name: 'Module',
        value: 'module_name'
    },
    {
        name: 'Content',
        value: 'content_name'
    },
    {
        name: 'User',
        value: 'displayName'
    },
    {
        name: 'Title',
        value: 'jobTitle'
    },
    {
        name: 'Completed',
        value: 'b_completed',
        boolean: true
    },
    {
        name: 'Date',
        value: 't_completed',
        datetime: true,
        utc: true
    },
    {
        name: 'Score',
        value: 'f_percent',
        percent: true
    },
    {
        name: 'Instructor',
        value: 's_instructor',
    },
    {
        name: 'Unit',
        value: 's_unit'
    },
    {
        name: 'Results',
        value: 'fas fa-file-download',
        icon: true,
        function: (item) => getQuizFileData(item.s_quiz_file_name)
    },
    {
        name: 'Download',
        value: 'fas fa-certificate',
        icon: true,
        showCondition: (item) => item.b_completed,
        function: (item) => selectQuizData(item.training_record_id)
    }
]