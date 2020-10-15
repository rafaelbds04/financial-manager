import { NavigationProp, ParamListBase } from "@react-navigation/native"
import moment from "moment"
import { showMessage } from "react-native-flash-message"

const catchErrorMessage = (message: string) => {
    showMessage({
        type: "danger",
        message: 'Ocorreu um erro',
        description: message,
        duration: 5000
    })
}

const unauthorized = (navigation: NavigationProp<ParamListBase>) => {
    navigation.reset({
        routes: [{ name: 'Preload' }]
    })

    showMessage({
        type: "danger",
        message: 'Ocorreu um erro',
        description: 'Acesso não autorizado',
        duration: 5000
    })
}

const setMomentLocale = () => {
    moment.defineLocale('pt-br', {
        months: 'janeiro_fevereiro_março_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
        monthsShort: 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
        weekdays: 'domingo_segunda-feira_terça-feira_quarta-feira_quinta-feira_sexta-feira_sábado'.split('_'),
        weekdaysShort: 'dom_seg_ter_qua_qui_sex_sáb'.split('_'),
        weekdaysMin: 'dom_2ª_3ª_4ª_5ª_6ª_sáb'.split('_'),
    })
}

export { catchErrorMessage, setMomentLocale, unauthorized }