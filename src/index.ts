import * as Blockly from 'blockly/core';
import "blockly/blocks";
import initMsg from "./msg";
import * as javascript from "blockly/javascript";
import toolbox from './toolbox';

const VARIABLE = 'VARIABLE';

function quote_(string: string): string {
    string = string
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\\n')
      .replace(/'/g, "\\'");
    return "'" + string + "'";
  }

class App {
    constructor() {
        initMsg();
        this.addBlocks();
        this.setupDOM();
        this.addGenerators();
        javascript.javascriptGenerator.addReservedWords('sort_result');
        javascript.javascriptGenerator.addReservedWords('filter_result');
        javascript.javascriptGenerator.addReservedWords('code');
        javascript.javascriptGenerator.addReservedWords('CCC');
        javascript.javascriptGenerator.addReservedWords('iter_f');
        javascript.javascriptGenerator.addReservedWords('my_curve');
        javascript.javascriptGenerator.addReservedWords('plus_lv');
        javascript.javascriptGenerator.addReservedWords('def_lv');
        javascript.javascriptGenerator.addReservedWords('_curves');
    }
    addGenerators() {
        javascript.javascriptGenerator.forBlock['set_sort_expr'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var statements_s = generator.statementToCode(block, 's');
            var value_v = generator.valueToCode(block, 'v', javascript.Order.ATOMIC) || '1';
            return `{let f=iter_f;${statements_s};sort_result=${value_v};}`;
        };
        javascript.javascriptGenerator.forBlock['set_filter_expr'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var statements_s = generator.statementToCode(block, 's');
            var value_v = generator.valueToCode(block, 'v', javascript.Order.ATOMIC) || '1';
            return `{let f = iter_f;${statements_s};filter_result=${value_v};}`;
        };
        /*javascript.javascriptGenerator.forBlock['with_enemy'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var statements_s = generator.statementToCode(block, 's');
            var value_v = generator.valueToCode(block, 'v', javascript.Order.ATOMIC);
            return `{let e = ${value_v};${statements_s};}`;
        };*/
        javascript.javascriptGenerator.forBlock['with_cat'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var statements_s = generator.statementToCode(block, 's');
            let n = block.getFieldValue('d');
            var value_v = generator.valueToCode(block, 'v', javascript.Order.MEMBER);
            if (n == '-1')
                n = value_v + '.forms.length - 1';
            var base = generator.valueToCode(block, 'base', javascript.Order.ASSIGNMENT) || '50';
            var plus = generator.valueToCode(block, 'plus', javascript.Order.ASSIGNMENT) || '0';
            return `{let f = (${value_v}).forms[(${n})];my_curve = _curves[${value_v}.curve];_info = ${value_v}.info;def_lv = ${base};plus_lv = ${plus};${statements_s}}`;
        };
        javascript.javascriptGenerator.forBlock['cat_has_effect'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`f.ab.hasOwnProperty(${n})`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_has_ability'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`f.ab.hasOwnProperty(${n})`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_has_imu'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`f.imu & ${n}`, javascript.Order.BITWISE_AND];
        };
        javascript.javascriptGenerator.forBlock['cat_has_res'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`f.hasres(${n})`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_property'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`f.get${n}()`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_ability'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`f.get${n}()`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_hpagainst'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE);
            return [`f.hpagainst(${n})`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_dpsagainst'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE);
            return [`f.dpsagainst(${n})`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_atktype'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            if (n == '-1')
                return ['f.pre1', javascript.Order.MEMBER];
            return [`f.atktype & ` + n, javascript.Order.BITWISE_AND];
        };
        javascript.javascriptGenerator.forBlock['get_cat'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE) || '0';
            return [`CCC.cats.at(${n})`, javascript.Order.FUNCTION_CALL];
        };
        /*
        javascript.javascriptGenerator.forBlock['get_enemy'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE);
            return [`(${n})`, javascript.Order.AWAIT];
        };*/
        javascript.javascriptGenerator.forBlock['cat_name'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            return ['f.name', javascript.Order.MEMBER];
        };
        javascript.javascriptGenerator.forBlock['cat_jpname'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            return ['f.jp_name', javascript.Order.MEMBER];
        };
        javascript.javascriptGenerator.forBlock['get_all_cat'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            return ['CCC.cats', javascript.Order.ATOMIC];
        };
        /*
        javascript.javascriptGenerator.forBlock['get_all_enemy'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            return ['await CCC.loadAllEnemies()', javascript.Order.AWAIT];
        };*/
        javascript.javascriptGenerator.forBlock['cat_involve_constant'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            const t = block.getFieldValue('t');
            return [`f.${t}(${n})`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_rarity'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`_info.rarity == ` + n, javascript.Order.EQUALITY];
        };
        javascript.javascriptGenerator.forBlock['cat_has_trait'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`Boolean(f.trait & ${n})`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_has_trait_icon'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [`Boolean(f.trait & ${n})`, javascript.Order.FUNCTION_CALL];
        };
        javascript.javascriptGenerator.forBlock['cat_trait_constant'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            return [n, javascript.Order.ATOMIC];
        };
        javascript.javascriptGenerator.forBlock['output_terminal'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE) || '""';
            return `CCC.makeText(${n})`;
        };
        javascript.javascriptGenerator.forBlock['output_table'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE) || '[]';
            return `CCC.makeTable(${n})`;
        };
        javascript.javascriptGenerator.forBlock['output_csv'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE) || '[]';
            return `CCC.download(${n}, 'csv')`;
        };
        javascript.javascriptGenerator.forBlock['output_tsv'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE) || '[]';
            return `CCC.download(${n}, 'tsv')`;
        };
        javascript.javascriptGenerator.forBlock['output_json'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var n = generator.valueToCode(block, 'v', javascript.Order.NONE) || '{}';
            return `CCC.download(${n}, 'json')`;
        };
        javascript.javascriptGenerator.forBlock['cat_form_length'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            return ['CCC.cats[f.id].forms.length', javascript.Order.MEMBER];
        };
        javascript.javascriptGenerator.forBlock['cat_status'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            const n = block.getFieldValue('d');
            var code;
            switch (n) {
                case '2': return ['CCC.cats[f.id].forms.length >= 2', javascript.Order.RELATIONAL];
                case '3': return ['CCC.cats[f.id].forms.length >= 3', javascript.Order.RELATIONAL];
                case '4': return ['CCC.cats[f.id].forms.length >= 4', javascript.Order.RELATIONAL];
                case 'super': return ['CCC.isSuper(_info)', javascript.Order.FUNCTION_CALL];
                case 'talent': return ['_info.hasOwnProperty("talents")', javascript.Order.FUNCTION_CALL] ;
            }
        };
        javascript.javascriptGenerator.forBlock['output_chart'] = function (block: Blockly.Block, generator: Blockly.Generator) {
            var dropdown_chart = block.getFieldValue('chart');
            var text_title = block.getFieldValue('title') || '圖表';
            const variable0 = generator.getVariableName(block.getFieldValue('VAR'));
            var value_xlabel = generator.valueToCode(block, 'xlabel', javascript.Order.NONE) || `CCC.str(${variable0})`;
            var value_y = generator.valueToCode(block, 'y', javascript.Order.NONE) || variable0;
            var argument0 = generator.valueToCode(block, 'FROM', javascript.Order.ASSIGNMENT) || '0';
            var argument1 = generator.valueToCode(block, 'TO', javascript.Order.ASSIGNMENT) || '10';
            var increment = generator.valueToCode(block, 'BY', javascript.Order.ASSIGNMENT) || '1';
            var branch = generator.statementToCode(block, 'DO');
            branch = generator.addLoopTrap(branch, block);
            const labelVar = generator.nameDB_!.getDistinctName('labels', VARIABLE);
            const dataVar = generator.nameDB_!.getDistinctName('datas', VARIABLE);
            let code = `var ${labelVar}=[];var ${dataVar}=[];`;
            if (
                Blockly.utils.string.isNumber(argument0) &&
                Blockly.utils.string.isNumber(argument1) &&
                Blockly.utils.string.isNumber(increment)
            ) {
                // All arguments are simple numbers.
                const up = Number(argument0) <= Number(argument1);
                code +=
                    'for (' +
                    variable0 +
                    ' = ' +
                    argument0 +
                    '; ' +
                    variable0 +
                    (up ? ' <= ' : ' >= ') +
                    argument1 +
                    '; ' +
                    variable0;
                const step = Math.abs(Number(increment));
                if (step === 1) {
                    code += up ? '++' : '--';
                } else {
                    code += (up ? ' += ' : ' -= ') + step;
                }
                code += ')';
            } else {
                // Cache non-trivial values to variables to prevent repeated look-ups.
                let startVar = argument0;
                if (!argument0.match(/^\w+$/) && !Blockly.utils.string.isNumber(argument0)) {
                    startVar = generator.nameDB_!.getDistinctName(
                        variable0 + '_start',
                        VARIABLE,
                    );
                    code += 'var ' + startVar + ' = ' + argument0 + ';\n';
                }
                let endVar = argument1;
                if (!argument1.match(/^\w+$/) && !Blockly.utils.string.isNumber(argument1)) {
                    endVar = generator.nameDB_!.getDistinctName(
                        variable0 + '_end',
                        VARIABLE,
                    );
                    code += 'var ' + endVar + ' = ' + argument1 + ';\n';
                }
                // Determine loop direction at start, in case one of the bounds
                // changes during loop execution.
                const incVar = generator.nameDB_!.getDistinctName(
                    variable0 + '_inc',
                    VARIABLE,
                );
                code += 'var ' + incVar + ' = ';
                if (Blockly.utils.string.isNumber(increment)) {
                    code += Math.abs(Number(increment)) + ';\n';
                } else {
                    code += 'Math.abs(' + increment + ');\n';
                }
                code += 'if (' + startVar + ' > ' + endVar + ') {\n';
                code += generator.INDENT + incVar + ' = -' + incVar + ';\n';
                code += '}\n';
                code +=
                    'for (' +
                    variable0 +
                    ' = ' +
                    startVar +
                    '; ' +
                    incVar +
                    ' >= 0 ? ' +
                    variable0 +
                    ' <= ' +
                    endVar +
                    ' : ' +
                    variable0 +
                    ' >= ' +
                    endVar +
                    '; ' +
                    variable0 +
                    ' += ' +
                    incVar +
                    ')';
            }
            code = `${code} {\n${branch};\n${dataVar}.push(${value_y});\n${labelVar}.push(${value_xlabel});\n}\n`;
            code += `new CCC.Chart(CCC.getChart(), {
'type': '${dropdown_chart}',
'data': {
    'labels': ${labelVar},
    'datasets': [{
        'label': ${quote_(text_title)},
        'data': ${dataVar},
        'borderWidth': 1,
        'pointStyle': 'rect',
        'pointRadius': 8,
        'pointHoverRadius': 10,
        'stepped': 'before'
    }]
},
    'options': { 'scales': {'y': {'beginAtZero': true } } }
})`;
            return code;
        };
    }
    addBlocks() {
        Blockly.Blocks['set_sort_expr'] = {
            init: function () {
                this.appendStatementInput("s")
                    .setCheck(null)
                    .appendField("設定排序表達式");
                this.appendValueInput("v")
                    .setCheck("Number")
                    .appendField("結果為(排序順位)");
                this.setInputsInline(false);
                this.setColour(230);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
            }
        };
        Blockly.Blocks['set_filter_expr'] = {
            init: function () {
                this.appendStatementInput("s")
                    .setCheck(null)
                    .appendField("設定篩選表達式");
                this.appendValueInput("v")
                    .setCheck("Boolean")
                    .appendField("結果為(符合條件？)");
                this.setInputsInline(false);
                this.setColour(230);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);

            }
        };
        /*Blockly.Blocks['with_enemy'] = {
            init: function () {
                this.appendValueInput("v")
                    .setCheck("Enemy")
                    .appendField("綁定敵人");
                this.appendStatementInput("s")
                    .setCheck(null)
                    .appendField("執行");
                this.setColour(230);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);

            }
        };*/
        Blockly.Blocks['with_cat'] = {
            init: function () {
                this.appendValueInput("v")
                    .setCheck("Cat")
                    .appendField("綁定貓咪");
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown([["第一形態", "0"], ["第二形態", "1"], ["第三形態", "2"], ["第四形態", "3"], ["最高形態", "-1"]]), "d");
                this.appendValueInput('base')
                    .appendField('基本等級')
                    .setCheck('Number');
                this.appendValueInput('plus')
                    .appendField('加值等級')
                    .setCheck('Number');
                this.appendStatementInput("s")
                    .setCheck(null)
                    .appendField("執行");
                this.setColour(230);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);

            }
        };
        Blockly.Blocks['cat_ability'] = {
            init: function () {
                this.appendValueInput('d')
                    .setCheck(null)
                    .appendField('能力＆效果')
                    .appendField(new Blockly.FieldDropdown([["會心一擊機率", "crit"], ["波動等級", "wavelv"], ["小波動等級", "miniwavelv"], ["烈波等級", "volclv"], ["小烈波等級", "minivolclv"], ["使動作變慢時間", "slow_time"], ["使動作變慢機率", "slow_prob"], ["使動作停止時間", "stop_time"], ["使動作停止機率", "stop_prob"], ["詛咒時間", "curse_time"], ["詛咒機率", "curse_prob"], ["使攻擊力下降時間", "weak_time"], ["使攻擊力下降發動機率", "weak_prob"], ["降低攻擊力幅度", "weak_extent"], ["攻擊力上升幅度", "strong_extent"], ["死前存活機率", "lethal_prob"], ["渾身一擊程度", "savage_extent"], ["渾身一擊機率", "savage_prob"], ["破壞護盾機率", "break_prob"], ["破壞惡魔盾機率", "shield_break_prob"], ["發射小波動機率", "mini_wave_prob"], ["發射波動機率", "wave_prob"], ["發射小烈波機率", "mini_surge_prob"], ["攻擊無效化時間(單位為F)", "dodge_time"], ["攻擊無效化機率", "dodge_prob"], ["超獸特效攻擊無效機率", "beast_prob"], ["超獸特效攻擊無效時間(單位為F)", "beast_time"], ["使動作停止的控場覆蓋率", "stop_cover"], ["使動作變慢的控場覆蓋率", "slow_cover"], ["攻擊力下降的控場覆蓋率", "weak_cover"], ["詛咒的控場覆蓋率", "curse_cover"]]), "d");
                this.setColour(230);

                this.setOutput(true, 'Number');
                this.setInputsInline(true);
            }
        };

        Blockly.Blocks['cat_has_effect'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField('擁有效果')
                    .appendField(new Blockly.FieldDropdown([["攻擊力下降", "21"],
                    ["使動作停止", "22"],
                    ["使動作變慢", "23"],
                    ["只能攻擊", "24"],
                    ["善於攻擊", "25"],
                    ["很耐打", "26"],
                    ["超級耐打", "27"],
                    ["超大傷害", "28"],
                    ["極度傷害", "29"],
                    ["打飛敵人", "30"],
                    ["傳送", "31"],
                    ["詛咒", "33"],
                    ["攻擊無效", "32"]]), "d");
                this.setColour(230);

                this.setOutput(true, 'Boolean');
                this.setInputsInline(true);
            }
        };
        Blockly.Blocks['cat_has_ability'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField('擁有能力')
                    .appendField(new Blockly.FieldDropdown([["攻擊力上升", "1"],
                    ["死前存活", "2"],
                    ["善於攻城", "3"],
                    ["會心一擊", "4"],
                    ["終結不死", "5"],
                    ["靈魂攻擊", "6"],
                    ["破壞護盾", "7"],
                    ["破壞惡魔盾", "8"],
                    ["渾身一擊", "9"],
                    ["得到很多金錢", "10"],
                    ["鋼鐵", "11"],
                    ["小波動", "12"],
                    ["波動", "13"],
                    ["小烈波", "14"],
                    ["烈波攻擊", "15"],
                    ["波動滅止", "16"],
                    ["單體攻擊", "1001"],
                    ["範圍攻擊", "1002"],
                    ["遠距攻擊", "1004"],
                    ["全方位攻擊", "1008"],
                    ["終結魔女", "19"],
                    ["終結使徒", "20"],
                    ["超生命體特效", "17"],
                    ["超獸特效", "18"],
                    ["一次攻擊", "37"],
                    ["烈波反擊", "40"]]), "d");
                this.setColour(230);

                this.setOutput(true, 'Boolean');
                this.setInputsInline(true);
            }
        };
        Blockly.Blocks['cat_has_imu'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField('擁有抗性')
                    .appendField(new Blockly.FieldDropdown([["攻擊力下降無效", "32"],
                    ["動作停止無效", "2"],
                    ["動作變慢無效", "4"],
                    ["打飛敵人無效", "8"],
                    ["波動傷害無效", "1"],
                    ["烈波傷害無效", "16"],
                    ["傳送無效", "64"],
                    ["古代的詛咒無效", "128"],
                    ["毒擊傷害無效", "256"],
                    ["魔王震波無效", "512"]]), "d");
                this.setColour(230);

                this.setOutput(true, 'Boolean');
                this.setInputsInline(true);
            }
        };
        Blockly.Blocks['cat_has_res'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField('擁有耐性')
                    .appendField(new Blockly.FieldDropdown([["抗擊耐性", "0"],
                    ["動止耐性", "1"],
                    ["動慢耐性", "2"],
                    ["抗飛耐性", "3"],
                    ["抗波耐性", "4"],
                    ["抗烈波耐性", "5"],
                    ["抗傳耐性", "8"],
                    ["抗古代詛咒耐性", "6"],
                    ["抗毒耐性", "7"]]), "d");
                this.setColour(230);

                this.setOutput(true, 'Boolean');
                this.setInputsInline(true);
            }
        };
        Blockly.Blocks['cat_property'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField('數值')
                    .appendField(new Blockly.FieldDropdown([["ID", "id"], ["攻擊對象", "trait"], ["血量", "hp"], ["攻擊力", "atk"], ["射程", "range"], ["攻擊頻率(秒)", "attacks"], ["攻擊頻率(F)", "attackf"], ["DPS", "dps"], ["KB", "kb"], ["再生產(秒)", "cd"], ["再生產(F)", "cdf"]]), "d");
                this.setColour(230);

                this.setOutput(true, 'Number');
                this.setInputsInline(true);
            }
        };
        Blockly.Blocks['cat_ability'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField('能力＆效果')
                    .appendField(new Blockly.FieldDropdown([["會心一擊機率","crit"], ["波動等級","wavelv"], ["小波動等級","miniwavelv"], ["烈波等級","volclv"], ["小烈波等級","minivolclv"], ["使動作變慢時間(無金寶、單位為F)","slow_time"], ["使動作變慢機率","slow_prob"], ["使動作停止時間(無金寶、單位為F)","stop_time"], ["使動作停止機率","stop_prob"], ["詛咒時間(無金寶、單位為F)","curse_time"], ["詛咒機率","curse_prob"], ["使攻擊力下降時間(無金寶、單位為F)","weak_time"], ["使攻擊力下降發動機率","weak_prob"], ["降低攻擊力幅度","weak_extent"], ["攻擊力上升幅度","strong_extent"], ["死前存活機率","lethal_prob"], ["渾身一擊程度","savage_extent"], ["渾身一擊機率","savage_prob"], ["破壞護盾機率","break_prob"], ["破壞惡魔盾機率","shield_break_prob\t"], ["發射小波動機率","mini_wave_prob"], ["發射波動機率","wave_prob"], ["發射小烈波機率","mini_surge_prob"], ["攻擊無效化時間(單位為F)","dodge_time"], ["攻擊無效化機率","dodge_prob\t"], ["超獸特效攻擊無效機率","beast_prob"], ["超獸特效攻擊無效時間(單位為F)","beast_time"], ["使動作停止的控場覆蓋率","stop_cover"], ["使動作變慢的控場覆蓋率","slow_cover"], ["攻擊力下降的控場覆蓋率","weak_cover"], ["詛咒的控場覆蓋率","curse_cover"]]), "d");
                this.setColour(230);
                this.setOutput(true, 'Number');
                this.setInputsInline(true);
            }
        };
        Blockly.Blocks['cat_hpagainst'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("對");
                this.appendValueInput("v")
                    .setCheck("Trait");
                this.appendDummyInput()
                    .appendField("血量");
                this.setColour(230);
                this.setInputsInline(true);

                this.setOutput(true, 'Number');

            }
        };
        Blockly.Blocks['cat_dpsagainst'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("對");
                this.appendValueInput("v")
                    .setCheck("Trait");
                this.appendDummyInput()
                    .appendField("每秒傷害");
                this.setColour(230);
                this.setInputsInline(true);

                this.setOutput(true, 'Number');

            }
        };
        Blockly.Blocks['cat_atktype'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("攻擊方式")
                    .appendField(new Blockly.FieldDropdown([["單體攻擊", "1"], ["範圍攻擊", "2"], ["遠距攻擊", "4"], ["全方位攻擊", "8"], ["擊退反擊", "16"], ['連續攻擊', "-1"]]), "d");
                this.setColour(230);
                this.setOutput(true, 'Boolean');
            }
        };
        Blockly.Blocks['get_cat'] = {
            init: function () {
                this.appendDummyInput().appendField('編號');
                this.appendValueInput("v")
                    .setCheck("Number")
                    .appendField("No.");
                this.appendDummyInput()
                    .appendField('的貓咪');
                this.setOutput(true, 'Cat');
                this.setInputsInline(true);
                this.setColour(230);

            }
        };
        /*
        Blockly.Blocks['get_enemy'] = {
            init: function () {
                this.appendDummyInput().appendField('編號');
                this.appendValueInput("v")
                    .setCheck("Number")
                    .appendField("No.");
                this.appendDummyInput()
                    .appendField('的敵人');
                this.setOutput(true, 'Enemy');
                this.setInputsInline(true);
                this.setColour(230);

            }
        };*/
        Blockly.Blocks['cat_name'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("中文名稱");
                this.setInputsInline(false);
                this.setColour(230);
                this.setOutput(true, 'String');


            }
        };
        Blockly.Blocks['cat_jpname'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("日文名稱");
                this.setInputsInline(false);
                this.setColour(230);
                this.setOutput(true, 'String');


            }
        };
        Blockly.Blocks['get_all_cat'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("所有的貓咪");
                this.setInputsInline(false);
                this.setColour(230);
                this.setOutput(true, 'Array');


            }
        };
        /*
        Blockly.Blocks['get_all_enemy'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("所有的敵人");
                this.setInputsInline(false);
                this.setColour(230);
                this.setOutput(true, 'Array');


            }
        };*/
        Blockly.Blocks['cat_involve_constant'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown([['第三進化', 'involve_require'], ['第四進化', 'involve4_require']]), 't');
                this.appendValueInput("v")
                    .setCheck("Number")
                    .appendField("進化所需的")
                    .appendField(new Blockly.FieldDropdown([["XP", "0"], ["綠色貓薄荷種子", "33"], ["綠色貓薄荷果實", "38"], ["紫色貓薄荷種子", "30"], ["紫色貓薄荷果實", "35"], ["紅色貓薄荷種子", "31"], ["紅色貓薄荷果實", "36"], ["藍色貓薄荷種子", "32"], ["藍色貓薄荷果實", "37"], ["黃色貓薄荷種子", "34"], ["黃色貓薄荷果實", "39"], ["彩虹貓薄荷種子", "43"], ["彩虹貓薄荷果實", "40"], ["古代貓薄荷種子", "41"], ["古代貓薄荷果實", "42"], ["惡貓貓薄荷種子", "160"], ["惡貓貓薄荷果實", "161"], ["黃金貓薄荷種子", "164"], ["黃金貓薄荷果實", "44"], ["紫獸石", "167"], ["紫獸石結晶", "179"], ["紅獸石", "168"], ["紅獸石結晶", "180"], ["蒼獸石", "169"], ["蒼獸石結晶", "181"], ["翠獸石", "170"], ["翠獸石結晶", "182"], ["黄獸石", "171"], ["黄獸石", "183"], ["虹獸石", "184"]]), "d");
                this.setColour(230);
                this.setInputsInline(true);

                this.setOutput(true, 'Number');

            }
        };
        Blockly.Blocks['cat_trait_constant'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown([["紅色敵人", "1"], ["飄浮敵人", "2"], ["黑色敵人", "4"], ["鋼鐵敵人", "8"], ["天使敵人", "16"], ["異星戰士", "32"], ["不死生物", "64"], ["無屬性敵人", "256"], ["古代種", "128"], ["惡魔", "2048"], ["超獸", "8192"], ["道場塔", "4096"], ["超生命體", "16384"], ["使徒", "512"], ["魔女", "1024"]]), "d");
                this.setColour(230);
                this.setOutput(true, 'Trait');
            }
        };
        Blockly.Blocks['cat_rarity'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("稀有度")
                    .appendField(new Blockly.FieldDropdown([["基本", "0"], ["EX", "1"], ["稀有", "2"], ["激稀有", "3"], ["超激稀有", "4"], ["傳說稀有", "5"]]), "d");
                this.setColour(230);
                this.setOutput(true, 'Boolean');
            }
        };
        Blockly.Blocks['cat_has_trait'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("攻擊對象包含")
                    .appendField(new Blockly.FieldDropdown([["紅色敵人", "1"], ["飄浮敵人", "2"], ["黑色敵人", "4"], ["鋼鐵敵人", "8"], ["天使敵人", "16"], ["異星戰士", "32"], ["不死生物", "64"], ["無屬性敵人", "256"], ["古代種", "128"], ["惡魔", "2048"], ["超獸", "8192"], ["道場塔", "4096"], ["超生命體", "16384"], ["使徒", "512"], ["魔女", "1024"]]), "d");
                this.setColour(230);
                this.setInputsInline(true);

                this.setOutput(true, 'Boolean');

            }
        };
        Blockly.Blocks['cat_has_trait_icon'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("攻擊對象包含")
                    .appendField(new Blockly.FieldDropdown([[{ "src": "https://i.imgur.com/BUxdmA6.png", "width": 26, "height": 26, "alt": "紅色敵人" }, "1"], [{ "src": "https://i.imgur.com/GlcKsa6.png", "width": 26, "height": 26, "alt": "飄浮敵人" }, "2"], [{ "src": "https://i.imgur.com/XbBWQIp.png", "width": 26, "height": 26, "alt": "黑色敵人" }, "4"], [{ "src": "https://i.imgur.com/fVfHaCQ.png", "width": 26, "height": 26, "alt": "鋼鐵敵人" }, "8"], [{ "src": "https://i.imgur.com/kxvTRTQ.png", "width": 26, "height": 26, "alt": "天使敵人" }, "16"], [{ "src": "https://i.imgur.com/PPpWAPy.png", "width": 26, "height": 26, "alt": "異星戰士" }, "32"], [{ "src": "https://i.imgur.com/oqVjofz.png", "width": 26, "height": 26, "alt": "不死生物" }, "64"], [{ "src": "https://i.imgur.com/qOEibJt.png", "width": 26, "height": 26, "alt": "無屬性敵人" }, "256"], [{ "src": "https://i.imgur.com/caSziI9.png", "width": 26, "height": 26, "alt": "古代種" }, "128"], [{ "src": "https://i.imgur.com/hp6EvG6.png", "width": 26, "height": 26, "alt": "惡魔" }, "2048"], [{ "src": "https://i.imgur.com/fjYhS3c.png", "width": 26, "height": 26, "alt": "超獸" }, "8192"], [{ "src": "https://i.imgur.com/ovv5SXv.png", "width": 26, "height": 26, "alt": "道場塔" }, "4096"], [{ "src": "https://i.imgur.com/3rfBGY3.png", "width": 26, "height": 26, "alt": "超生命體" }, "16384"], [{ "src": "https://i.imgur.com/J4DgvdU.png", "width": 26, "height": 26, "alt": "使徒" }, "512"], [{ "src": "https://i.imgur.com/xiMxJwC.png", "width": 26, "height": 26, "alt": "魔女" }, "1024"]]), "d");
                this.setColour(230);
                this.setInputsInline(true);
                this.setOutput(true, 'Boolean');
            }
        };
        Blockly.Blocks['cat_status'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField(new Blockly.FieldDropdown([
                        ['開放第二形態', '2'],
                        ['開放第三形態', '3'],
                        ['開放第四形態', '4'],
                        ['開放本能', 'talent'],
                        ['開放超本能', 'super'],
                    ]), "d");
                this.setColour(230);
                this.setInputsInline(true);
                this.setOutput(true, 'Boolean');
            }
        };
        Blockly.Blocks['cat_form_length'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("貓咪的形態數");
                this.setInputsInline(false);
                this.setColour(230);
                this.setOutput(true, 'Array');
            }
        };
        Blockly.Blocks['output_terminal'] = {
            init: function () {
                this.appendValueInput("v")
                    .appendField("輸出文字");
                this.setColour(230);
                this.setTooltip("");
                this.setHelpUrl("");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
            }
        };
        Blockly.Blocks['output_table'] = {
            init: function () {
                this.appendValueInput("v")
                    .setCheck('Array')
                    .appendField("輸出表格");
                this.setColour(230);
                this.setTooltip("");
                this.setHelpUrl("");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
            }
        };
        Blockly.Blocks['output_csv'] = {
            init: function () {
                this.appendValueInput("v")
                    .setCheck('Array')
                    .appendField("下載CSV檔");
                this.setColour(230);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Blocks['output_tsv'] = {
            init: function () {
                this.appendValueInput("v")
                    .setCheck('Array')
                    .appendField("下載TSV檔");
                this.setColour(230);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
        Blockly.Blocks['output_json'] = {
            init: function () {
                this.appendValueInput("v")
                    .appendField("下載JSON檔");
                this.setColour(230);
                this.setTooltip("");
                this.setHelpUrl("");
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
            }
        };
        Blockly.Blocks['output_chart'] = {
            init: function () {
                this.appendDummyInput()
                    .appendField("繪製")
                    .appendField(new Blockly.FieldDropdown([["折線圖", "line"], ["長條圖", "bar"]]), "chart")
                    .appendField(new Blockly.FieldTextInput("標題"), "title")
                    .appendField('x座標為 循環計數')
                    .appendField(new Blockly.FieldVariable("x"), "VAR");
                this.appendValueInput("FROM")
                    .setCheck("Number")
                    .appendField("從");
                this.appendValueInput("TO")
                    .setCheck("Number")
                    .appendField("到");
                this.appendValueInput("BY")
                    .setCheck("Number")
                    .appendField("每次增加");
                this.appendStatementInput("DO")
                    .setCheck(null)
                    .appendField("執行");
                this.appendValueInput("y")
                    .setCheck("Number")
                    .appendField("y=");
                this.appendValueInput("xlabel")
                    .setCheck("String")
                    .appendField("x標籤為");
                this.setInputsInline(true);
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setColour(230);
                this.setTooltip("");
                this.setHelpUrl("");
            }
        };
    }
    setupDOM() {
        const workspace = Blockly.inject('blocklyDiv', {
            'toolbox': toolbox
        });
        document.getElementById('runBlockly').onclick = function () {
            const code = javascript.javascriptGenerator.workspaceToCode(workspace);
            try {
                eval(code);
            } catch (e) {
                console.error(e);
                alert(e);
            }
        }
    }
}

new App();
