pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = "harithabandara/frontend-app"
        BACKEND_IMAGE = "harithabandara/backend-app"
        GIT_REPO = "https://github.com/haritha380/devops.git"
        DOCKER_CREDENTIALS_ID = 'harithabandara'
    }

    options {
        timestamps()
        ansiColor('xterm')
        buildDiscarder(logRotator(daysToKeepStr: '7', numToKeepStr: '5'))
    }

    stages {
        // ADDED: Stop existing containers and clean Docker cache/images before building
        stage('Cleanup Environment') {
            steps {
                script {
                    echo 'Stopping existing containers and cleaning cache...'
                    // Stop containers if they are running (ignore error if they aren't)
                    sh 'docker stop backend-app frontend-app || true'
                    sh 'docker rm backend-app frontend-app || true'
                    
                    // Delete build cache and dangling images to free up space
                    sh 'docker builder prune -f'
                    sh 'docker image prune -f'
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout([$class: 'GitSCM', branches: [[name: 'refs/heads/main']], userRemoteConfigs: [[url: env.GIT_REPO]]])
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    // Build with --no-cache to ensure a fresh build as requested
                    sh "docker build --no-cache -t ${BACKEND_IMAGE}:latest -f backend/Dockerfile backend"
                }
            }
        }
        
        stage('Backend setup') {
            steps {
                script {
                    sh "cp /var/lib/jenkins/.backend-env /var/lib/jenkins/workspace/Musical-Instrument-Seller/backend/.env"
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    sh "docker build --no-cache -t ${FRONTEND_IMAGE}:latest -f frontend/Dockerfile frontend"
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
        
        stage('Deploy Docker Compose') {
            steps {
                sh """
                ssh 13.126.171.198 'docker-compose up -d --pull always'
                """
            }
        }
    }

    post {
        always {
            script {
                sh 'docker logout || true'
                // Final prune to remove intermediate layers used during the build
                sh 'docker system prune -f'
                cleanWs()
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