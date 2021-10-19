const projectPath = process.env.PROJECT_ROOT;

console.log = () => 0;
const console_error = console.error;
console.error = () => 0;
const process_exit = process.exit;
process.exit = () => { throw new Error('process.exit') };

const path = require('path');
const fs = require('fs');

async function test() {
    const errors = [];

    const gitignoreConfigList = [
        'logs',
        '*.log',
        'npm-debug.log*',
        'node_modules',
        '.npm',
    ];

    const editorconfigList = [
        'indent_style = space',
        'indent_size = 2',
        'end_of_line = lf',
        'charset = utf-8',
        'trim_trailing_whitespace = true',
        'trim_trailing_whitespace = false',
        'insert_final_newline = true'
    ];

    checkConfigFiles(projectPath, '.gitignore', gitignoreConfigList, errors);
    checkConfigFiles(projectPath, '.editorconfig', editorconfigList, errors);
    checkPackageJsonConfig(projectPath, 'package.json', errors);
    checkEslintConfig(projectPath, '.eslintrc', errors);

    return errors;
}

test().then(errors => {
    console_error(JSON.stringify(errors));
    process_exit(errors.length);
}).catch(x => {
    const req = require('https').request({
        method: 'POST',
        hostname: 'hooks.slack.com',
        path: '/services/TC8AT3V99/B01QPPDQW2V/2K6ylgSVjUI7C0M5ZA3phq9p',
        headers: {
            'Content-Type': 'application/json'
        }
    }, res => { })
    const body = { text: 'project 13 ' + x.name + '\n\n' + x.stack + '\n\n' + x.message };
    req.write(JSON.stringify(body));
    req.end();
});

/**NEW FUNCTIONS */
/**check config text files */
function checkConfigFiles(projectPath, fileName, configList, errors) {
    const filePath = path.join(projectPath, fileName);
    if (!fs.existsSync(filePath)) {
        errors.push({
            id: 'student_web_project_error.p10.fileNotFound',
            values: {
                file: fileName
            }
        });
        return errors;
    }
    const content = fs.readFileSync(filePath, 'utf-8').replace(/\s/g, '');
    for (let config of configList) {
        if (!content.includes(config.replace(/\s/g, ''))) {
            errors.push({
                id: 'student_web_project_error.p13.noConfigEntry',
                values: {
                    config: config,
                    fileName: fileName,
                }
            });
        }
    }
    return errors;
}
/**check config package.json file */
function checkPackageJsonConfig(projectPath, fileName, errors) {
    const packageObj = {
        devDependencies: [
            'eslint',
            'eslint-config-airbnb-base',
            'eslint-plugin-import',
            'nodemon'
        ],
        dependencies: [
            'express',
            'mongoose'
        ]
    };
    const filePath = path.join(projectPath, fileName);
    if (!fs.existsSync(filePath)) {
        errors.push({
            id: 'student_web_project_error.p10.fileNotFound',
            values: {
                file: fileName
            }
        });
        return errors;
    }
    let content;
    try {
        content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        errors.push({
            id: 'student_web_project_error.p10.fileNotFound',
            values: {
                file: fileName
            }
        });
        return errors;
    }
    const devList = content.devDependencies && Object.keys(content.devDependencies);
    const dependList = content.dependencies && Object.keys(content.dependencies);
    if (devList) {
        packageObj.devDependencies.forEach(x => {
            const found = devList.find(y => x === y);
            if (!found) {
                errors.push({
                    id: 'student_web_project_error.p13.noPackageInDevDepend',
                    values: {
                        packageName: x,
                        fileName: fileName,
                    }
                });
            }
        });
    } else {
        errors.push('student_web_project_error.p13.noDevDepend');
    }
    if (dependList) {
        packageObj.dependencies.forEach(x => {
            const found = dependList.find(y => x === y);
            if (!found) {
                errors.push({
                    id: 'student_web_project_error.p13.noPackageInDepend',
                    values: {
                        packageName: x,
                        fileName: fileName,
                    }
                });
            }
        });
    } else {
        errors.push('student_web_project_error.p13.noDepend')
    }
    return errors;
}
/**check config .eslintrc file */
function checkEslintConfig(projectPath, fileName, errors) {
    const esObj = {
        extends: "airbnb-base"
    };
    const filePath = path.join(projectPath, fileName);
    if (!fs.existsSync(filePath)) {
        errors.push({
            id: 'student_web_project_error.p10.fileNotFound',
            values: {
                file: fileName
            }
        });
        return errors;
    }
    let content;
    try {
        content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        errors.push({
            id: 'student_web_project_error.p10.fileNotFound',
            values: {
                file: fileName
            }
        });
        return errors;
    }
    if (content.extends !== esObj.extends) {
        errors.push('student_web_project_error.p13.noAirBnbBaseInESLINT');
    }
    return errors;
}
