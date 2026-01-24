pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "harithabandara/frontend-app"
        BACKEND_IMAGE = "harithabandara/backend-app"
        GIT_REPO = "https://github.com/haritha380/devops.git"
        // Docker Hub credentials id (configure in Jenkins credentials)
        DOCKER_CREDENTIALS_ID = 'harithabandara'
    }

    options {
        timestamps()
        ansiColor('xterm')
        // keep build logs for 30 days
        buildDiscarder(logRotator(daysToKeepStr: '30'))
    }

    stages {
        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: 'refs/heads/main']], userRemoteConfigs: [[url: env.GIT_REPO]]])
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    // Build backend docker image using backend/Dockerfile
                    sh "docker build -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile backend"
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    // Build frontend docker image using multi-stage Dockerfile
                    sh "docker build -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile frontend"
                }
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.DOCKER_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    script {
                        sh 'echo "Logging in to Docker registry..."'
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        sh "docker push ${BACKEND_IMAGE}:latest"
                        sh "docker push ${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Best-effort logout and cleanup
                sh 'docker logout || true'
            }
        }

        success {
            echo 'Pipeline finished successfully.'
        }

        failure {
            echo 'Pipeline failed. Check logs.'
        }
    }
}
