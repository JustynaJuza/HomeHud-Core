// react
import * as React from 'react'

// redux
import { connect } from 'react-redux';
import { IAppState } from '../../store/state';
import { requestActionCreators } from '../../store/request/requestActionCreators';

// redux-form
import { Field, reduxForm, initialize, InjectedFormProps, SubmissionError, change, touch } from 'redux-form';
import * as FieldRenderer from '../forms/fieldRendering'
import * as Validation from '../forms/validation';
import { IFormResult, IFormError } from '../forms/formResult';
import { IUser } from '../../store/config/configState';
import { Api } from '../../store/api';
import { RouteComponentProps } from 'react-router-dom';

// style
import * as style from '../../css/components/forms.css';

// component ---------------------------------------------------------------------------------

interface ILoginFormData {
    username: string;
    password: string;
}

interface ILoginFormResult extends IFormResult {
    user: IUser;
}

interface ILoginFormProps {
    baseUrl: string;
}

type LoginFormPropsType =
    ILoginFormProps
    & RouteComponentProps<void>
    //& FormProps<ILoginFormData, void, void>
    & InjectedFormProps<ILoginFormData, {}>
    & typeof requestActionCreators;

class LoginForm extends React.Component<LoginFormPropsType, {}> {

    private api: Api = new Api();

    constructor(props: LoginFormPropsType) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    public submit(values: ILoginFormData) {
        return this.api.postJson(this.props.baseUrl + '/account/login', values)
            .then(this.processResponse.bind(this))
            .catch(this.formatSubmitErrors);
    }

    private processResponse(formResult: ILoginFormResult) {
        if (!formResult.success) {
            return Promise.reject(formResult.errors);
        }

        this.props.logIn(formResult.user, undefined);
        return Promise.resolve();
    }

    private formatSubmitErrors(formErrors: IFormError[]) {
        var errorSummary: {[key:string]:string} = {};

        for (var i = 0; i < formErrors.length; i++) {
            var formError = formErrors[i];
            errorSummary[formError.fieldName ? formError.fieldName.toLowerCase() : '_error'] = formError.errorMessage;
        }

        return Promise.reject(new SubmissionError(errorSummary));
    }

    public render() {
        const { error, handleSubmit, pristine, reset, submitting, valid } = this.props;

        return (
            <form onSubmit={handleSubmit(this.submit)} className={style.container}>

                <Field name="username" id="login_username"
                    label="Username"
                    component={FieldRenderer.textField}
                    validate={[Validation.required]} />

                <Field name="password" id="login_password"
                    type="password"
                    label="Password"
                    component={FieldRenderer.textField}
                    validate={[Validation.required]} />

                {error && <span className={style._error}>{error}</span>}

                <button
                    type="submit"
                    disabled={pristine || !valid || submitting}
                    className={style.button}>
                    Submit
                </button>

            </form>
        );
    }
}

// redux ---------------------------------------------------------------------------------

const form = reduxForm({
    form: LoginForm.name,
})(LoginForm);

export default connect(
    (state: IAppState, publicProps: InjectedFormProps<ILoginFormData, {}> & RouteComponentProps<void>) => ({
        baseUrl: state.request.baseUrl
    }),
    requestActionCreators
)(form);
